import os
import uuid
from typing import Dict, Any, List

import cv2
from ultralytics import YOLO

# Carpeta base donde se guardan los archivos servidos al frontend
MEDIA_ROOT = os.getenv("MEDIA_ROOT", "media")
PROCESSED_DIR = os.path.join(MEDIA_ROOT, "processed_videos")
os.makedirs(PROCESSED_DIR, exist_ok=True)

# Carga del modelo YOLO
MODEL_PATH = os.getenv("YOLO_MODEL_PATH", "app/model/best.pt")
MODEL = YOLO(MODEL_PATH)


def process_video_with_yolo(file_path: str, max_capacity: int = 50) -> Dict[str, Any]:
    """
    Procesa un video con YOLO, genera un MP4 anotado y una línea de tiempo
    con conteo de personas y detecciones por frame.

    Devuelve:
      - ruta absoluta y URL pública del video procesado
      - métricas del procesamiento
      - timeline con detecciones
    """
    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        raise RuntimeError("No se pudo abrir el video para procesamiento")

    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    video_id = uuid.uuid4().hex
    output_filename = f"{video_id}_processed.mp4"
    output_path = os.path.join(PROCESSED_DIR, output_filename)

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    timeline: List[Dict[str, Any]] = []
    frame_index = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Inferencia con YOLO
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
    video_url = f"/media/processed_videos/{output_filename}"

    return {
        "video_path": output_path,         # ruta en el servidor
        "video_url": video_url,           # URL pública para el frontend
        "fps": fps,
        "width": width,
        "height": height,
        "total_frames": frame_index,
        "duration_seconds": duration,
        "max_capacity": max_capacity,
        "peak_count": peak_count,
        "avg_confidence": avg_conf_overall,
        "timeline": timeline,             # AQUÍ está todo para estadísticas y BD
    }
