import apiClient from './apiClient';

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
