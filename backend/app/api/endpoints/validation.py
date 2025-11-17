from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Any       
import os, tempfile  
from app.api import deps
from app.models.validation import ValidationSession, ValidationFrameStat
from app.schemas.validation import (
    ValidationSessionCreate,
    ValidationSessionOut,
    ValidationFrameStatOut,
)
from app.services.video_processing import process_video_with_yolo 
router = APIRouter(prefix="/validation", tags=["validation"])


@router.post("/sessions", response_model=ValidationSessionOut)
def create_validation_session(
    session_in: ValidationSessionCreate,
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_user),
):
    session = ValidationSession(
        created_by_user_id=current_user.id,
        bus_id=session_in.bus_id,
        max_capacity_declared=session_in.max_capacity_declared,
        status="PENDING",
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions", response_model=list[ValidationSessionOut])
def list_validation_sessions(
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_user),
):
    sessions = (
        db.query(ValidationSession)
        .order_by(ValidationSession.created_at.desc())
        .all()
    )
    return sessions


@router.get("/sessions/{session_id}", response_model=ValidationSessionOut)
def get_validation_session(
    session_id: int,
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_user),
):
    session = db.query(ValidationSession).filter(ValidationSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.get("/sessions/{session_id}/frame-stats", response_model=list[ValidationFrameStatOut])
def get_validation_frame_stats(
    session_id: int,
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_user),
):
    stats = (
        db.query(ValidationFrameStat)
        .filter(ValidationFrameStat.validation_session_id == session_id)
        .order_by(ValidationFrameStat.timestamp_relative)
        .all()
    )
    return stats


@router.post("/sessions/{session_id}/upload-video", response_model=ValidationSessionOut)
async def upload_validation_video(
    session_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_user),
):
    # Aquí solo guardamos el nombre del archivo "mock".
    # Más adelante se puede integrar un almacenamiento real (S3, disco, etc.)
    session = db.query(ValidationSession).filter(ValidationSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.original_video_path = f"/media/validation/{session_id}/{file.filename}"
    session.status = "PROCESSING"
    db.commit()
    db.refresh(session)

    # Más adelante: lanzar job para procesar el video,
    # generar processed_video_path, frame_stats, etc.

    return session

@router.post("/process-video")
async def process_validation_video(
    file: UploadFile = File(...),
    max_capacity: int = Form(50),
    current_user=Depends(deps.get_current_user),
) -> Any:
    """
    Recibe un video, lo procesa con YOLO y devuelve:
      - video_url (ruta accesible en /media/...)
      - métricas globales
      - timeline de detecciones
    (por ahora NO guarda nada en BD; eso lo hacemos luego)
    """
    try:
        suffix = os.path.splitext(file.filename)[1] or ".mp4"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        result = process_video_with_yolo(tmp_path, max_capacity=max_capacity)

        # limpiar archivo temporal
        try:
            os.unlink(tmp_path)
        except OSError:
            pass

        return result
    except Exception as e:
        print(f"[ERROR] procesando video: {e}")
        raise HTTPException(status_code=500, detail="Error procesando video")