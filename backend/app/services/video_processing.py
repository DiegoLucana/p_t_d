import logging
import os
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional

import cv2
from ultralytics import YOLO

from app.models.validation import ValidationFrameStat, ValidationSession

# Logger configuration
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Carpeta base donde se guardan los archivos servidos al frontend
MEDIA_ROOT = os.getenv("MEDIA_ROOT", "media")
PROCESSED_DIR = os.path.join(MEDIA_ROOT, "processed_videos")
os.makedirs(PROCESSED_DIR, exist_ok=True)

# Carga del modelo YOLO con trazas explícitas
MODEL_PATH = os.getenv("YOLO_MODEL_PATH", "app/model/best.pt")
logger.info("Loading YOLO model from %s", MODEL_PATH)
MODEL = YOLO(MODEL_PATH)
logger.info("YOLO model loaded successfully")


def process_video_with_yolo(
    file_path: str,
    max_capacity: int = 50,
    output_filename: Optional[str] = None,
    log_every_n_frames: int = 1,
) -> Dict[str, Any]:
    """
    Procesa un video con YOLO, genera un MP4 anotado y una línea de tiempo
    con conteo de personas y detecciones por frame.

    Devuelve:
      - ruta absoluta y URL pública del video procesado
      - métricas del procesamiento
      - timeline con detecciones
    """
    logger.info("Starting YOLO processing for %s", file_path)
    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        raise RuntimeError("No se pudo abrir el video para procesamiento")

    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    video_id = uuid.uuid4().hex
    chosen_output_name = output_filename or f"{video_id}_processed.mp4"
    output_path = os.path.join(PROCESSED_DIR, chosen_output_name)

    # Prefer H.264/avc1 for broad browser support; fallback to mp4v if unavailable
    preferred_fourcc = cv2.VideoWriter_fourcc(*"avc1")
    out = cv2.VideoWriter(output_path, preferred_fourcc, fps, (width, height))
    if not out.isOpened():
        logger.warning("Falling back to mp4v codec for processed video output")
        fallback_fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        out = cv2.VideoWriter(output_path, fallback_fourcc, fps, (width, height))

    timeline: List[Dict[str, Any]] = []
    frame_index = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Inferencia con YOLO
        logger.info("Processing frame %s", frame_index)
        results = MODEL(frame, imgsz=640, conf=0.3)[0]
        boxes = results.boxes

        detections: List[Dict[str, float]] = []
        for b in boxes:
            x1, y1, x2, y2 = b.xyxy[0].tolist()
            conf = float(b.conf[0])
            detections.append(
                {
                    "x": float(x1),
                    "y": float(y1),
                    "width": float(x2 - x1),
                    "height": float(y2 - y1),
                    "confidence": conf,
                }
            )

        # Conteo de personas (suponiendo clase 0 = persona/cabeza)
        if hasattr(boxes, "cls"):
            persons = int((boxes.cls == 0).sum().item())
        else:
            persons = len(detections)

        if frame_index % log_every_n_frames == 0:
            logger.info("Detections found: %s persons on frame %s", persons, frame_index)

        # Frame anotado
        annotated = results.plot()
        if annotated.shape[1] != width or annotated.shape[0] != height:
            annotated = cv2.resize(annotated, (width, height))

        out.write(annotated)

        timestamp = frame_index / fps
        avg_conf = (
            float(sum(d["confidence"] for d in detections) / len(detections))
            if detections
            else 0.0
        )

        timeline.append(
            {
                "timestamp": timestamp,
                "count": persons,
                "confidence": avg_conf,
                "detections": detections,
                "is_over_capacity": persons > max_capacity,
            }
        )

        frame_index += 1

    cap.release()
    out.release()

    duration = frame_index / fps if fps else 0.0
    peak_count = max((item["count"] for item in timeline), default=0)
    avg_conf_overall = (
        float(sum(item["confidence"] for item in timeline) / len(timeline))
        if timeline
        else 0.0
    )

    # Ruta que el frontend usará (la serviremos desde FastAPI)
    video_url = f"/media/processed_videos/{chosen_output_name}"
    logger.info("Processed video saved to %s", output_path)

    return {
        "video_path": output_path,  # ruta en el servidor
        "video_url": video_url,  # URL pública para el frontend
        "fps": fps,
        "width": width,
        "height": height,
        "total_frames": frame_index,
        "duration_seconds": duration,
        "max_capacity": max_capacity,
        "peak_count": peak_count,
        "avg_confidence": avg_conf_overall,
        "timeline": timeline,  # AQUÍ está todo para estadísticas y BD
    }


def process_and_persist_validation_session(
    db_session,
    validation_session: ValidationSession,
    source_video_path: str,
    max_capacity: Optional[int] = None,
) -> ValidationSession:
    """Procesa un video de validación y guarda resultados en BD."""
    logger.info(
        "Starting validation processing for session %s with video %s",
        validation_session.id,
        source_video_path,
    )
    # limpiar resultados previos por si se reprocesa
    db_session.query(ValidationFrameStat).filter(
        ValidationFrameStat.validation_session_id == validation_session.id
    ).delete()
    db_session.commit()

    result = process_video_with_yolo(
        source_video_path,
        max_capacity=max_capacity or validation_session.max_capacity_declared,
        output_filename=f"{validation_session.id}.mp4",
    )

    validation_session.processed_video_path = result["video_url"]
    validation_session.total_frames = result["total_frames"]
    validation_session.detected_max_occupancy = result["peak_count"]
    validation_session.status = "COMPLETED"
    validation_session.processing_finished_at = datetime.utcnow()

    # Guardar estadísticas por frame
    for idx, frame in enumerate(result["timeline"]):
        stat = ValidationFrameStat(
            validation_session_id=validation_session.id,
            frame_index=idx,
            timestamp_relative=frame.get("timestamp"),
            detected_passengers=frame.get("count", 0),
            raw_metadata_json=frame,
        )
        db_session.add(stat)

    db_session.add(validation_session)
    db_session.commit()
    db_session.refresh(validation_session)

    logger.info(
        "Validation session %s completed. Processed video at %s",
        validation_session.id,
        validation_session.processed_video_path,
    )
    return validation_session
