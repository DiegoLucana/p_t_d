// src/services/apiClient.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||   "https://regulation-resistance-hockey-highly.trycloudflare.com/api/v1";


const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Inyectar automáticamente el token si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;

export const uploadValidationVideo = async (file, maxCapacity = 50) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('max_capacity', maxCapacity);

  const response = await apiClient.post(
    '/validation/process-video',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data; // { video_url, timeline, summary, ... }
};
