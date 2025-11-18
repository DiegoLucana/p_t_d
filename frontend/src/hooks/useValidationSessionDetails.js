import { useCallback, useEffect, useState } from 'react';
import { getValidationFrameStats, getValidationSession } from '../services/validation';

const mapFrameToDetection = (frame, index) => {
  const rawDetections = frame?.raw_metadata_json?.detections;
  const detections = Array.isArray(rawDetections)
    ? rawDetections.map((detection) => ({
        x: Number(detection?.x ?? detection?.bbox?.[0] ?? 0),
        y: Number(detection?.y ?? detection?.bbox?.[1] ?? 0),
        width: Number(detection?.width ?? detection?.bbox?.[2] ?? 0),
        height: Number(detection?.height ?? detection?.bbox?.[3] ?? 0),
        confidence: Number(detection?.confidence ?? detection?.score ?? 0),
      }))
    : [];

  const timestamp = Number(frame?.timestamp_relative ?? index);
  const count = Number(frame?.detected_passengers ?? detections.length ?? 0);
  const confidence =
    frame?.raw_metadata_json?.confidence !== undefined
      ? Number(frame?.raw_metadata_json?.confidence)
      : null;

  return {
    timestamp,
    count,
    confidence,
    detections,
  };
};

const useValidationSessionDetails = (sessionId) => {
  const [session, setSession] = useState(null);
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetails = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const [sessionData, frameStats] = await Promise.all([
        getValidationSession(sessionId),
        getValidationFrameStats(sessionId),
      ]);

      setSession(sessionData);
      const mappedFrames = Array.isArray(frameStats)
        ? frameStats.map((frame, idx) => mapFrameToDetection(frame, idx))
        : [];
      setFrames(mappedFrames);
    } catch (err) {
      const message = err?.response?.data?.detail || 'No se pudieron cargar los datos de la sesión.';
      setError(message);
      setSession(null);
      setFrames([]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { session, frames, loading, error, refresh: fetchDetails };
};

export default useValidationSessionDetails;
