import apiClient from './apiClient';

const buildReportPayload = (sessionDetails, frameStats) => ({
  session: sessionDetails,
  metrics: {
    detected_max_occupancy: sessionDetails?.detected_max_occupancy,
    max_capacity_declared: sessionDetails?.max_capacity_declared,
    total_frames: sessionDetails?.total_frames,
    status: sessionDetails?.status,
  },
  frames: frameStats,
  generated_at: new Date().toISOString(),
});


export const getValidationSessions = async () => {
  const response = await apiClient.get('/validation/sessions');
  return response.data;
};

export const createValidationSession = async ({ maxCapacity, busId = null }) => {
  const response = await apiClient.post('/validation/sessions', {
    max_capacity_declared: maxCapacity,
    bus_id: busId,
  });
  return response.data;
};

export const uploadSessionVideo = async (sessionId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post(
    `/validation/sessions/${sessionId}/upload-video`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};

export const getValidationSession = async (sessionId) => {
  const response = await apiClient.get(`/validation/sessions/${sessionId}`);
  return response.data;
};

export const getValidationFrameStats = async (sessionId) => {
  const response = await apiClient.get(`/validation/sessions/${sessionId}/frame-stats`);
  return response.data;
};

export const buildValidationSessionReport = async (sessionId) => {
  const [sessionDetails, frameStats] = await Promise.all([
    getValidationSession(sessionId),
    getValidationFrameStats(sessionId),
  ]);

  return buildReportPayload(sessionDetails, frameStats);
};

export const downloadValidationReport = (payload, filename) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const exportValidationReport = async (sessionId, allSessions = []) => {
  if (sessionId === 'all') {
    const sessionsToExport = (allSessions || []).filter((session) => session?.id);
    if (sessionsToExport.length === 0) return;

    const reports = await Promise.all(
      sessionsToExport.map((session) => buildValidationSessionReport(session?.id))
    );

    downloadValidationReport(
      { generated_at: new Date().toISOString(), sessions: reports },
      'validaciones.json'
    );
  } else if (sessionId) {
    const report = await buildValidationSessionReport(sessionId);
    const filename = `validacion-${sessionId}.json`;
    downloadValidationReport(report, filename);
  }
};
