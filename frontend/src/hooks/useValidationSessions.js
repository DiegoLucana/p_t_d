import { useCallback, useEffect, useMemo, useState } from 'react';
import { getValidationSessions } from '../services/validation';

const parseStatus = (status) => status?.toLowerCase?.() ?? 'pending';

const buildFilename = (session) => {
  const fromProcessed = session?.processed_video_path?.split('/')?.pop();
  const fromOriginal = session?.original_video_path?.split('/')?.pop();
  return fromProcessed || fromOriginal || `sesion-${session?.id ?? 'sin-id'}`;
};

const mapSessionToUi = (session) => {
  const createdAt = session?.created_at ? new Date(session.created_at) : null;
  const duration = session?.total_frames
    ? `${Math.round(session.total_frames / 30)}s`
    : '—';

  return {
    id: session?.id,
    filename: buildFilename(session),
    date: createdAt?.toISOString?.() || session?.created_at,
    duration,
    fileSize: '—',
    detectedCount: session?.detected_max_occupancy ?? 0,
    maxCapacity: session?.max_capacity_declared ?? 0,
    accuracy: session?.detected_max_occupancy ? 100 : null,
    confidence: null,
    status: parseStatus(session?.status),
    raw: session,
  };
};

const useValidationSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getValidationSessions();
      const normalized = Array.isArray(data) ? data : [];
      setSessions(normalized);
    } catch (err) {
      const message = err?.response?.data?.detail || 'No se pudieron obtener las sesiones de validación.';
      setError(message);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const uiSessions = useMemo(() => sessions.map(mapSessionToUi), [sessions]);

  return { sessions: uiSessions, rawSessions: sessions, loading, error, refresh };
};

export default useValidationSessions;
