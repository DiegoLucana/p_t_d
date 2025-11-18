import { useCallback, useEffect, useState } from 'react';
import { getValidationFrameStats, getValidationSession } from '../services/validation';

const mapFrameToDetection = (frame, index) => {
  const rawDetections = frame?.raw_metadata_json?.detections;
  const detections = Array.isArray(rawDetections)
    ? rawDetections.map((detection) => ({
        x: detection?.x ?? detection?.bbox?.[0] ?? 0,
        y: detection?.y ?? detection?.bbox?.[1] ?? 0,
        width: detection?.width ?? detection?.bbox?.[2] ?? 0,
        height: detection?.height ?? detection?.bbox?.[3] ?? 0,
        confidence: detection?.confidence ?? detection?.score ?? 0,
      }))
    : [];

  return {
    timestamp: frame?.timestamp_relative ?? index,
    count: frame?.detected_passengers ?? detections.length,
    confidence: frame?.raw_metadata_json?.confidence ?? null,
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
