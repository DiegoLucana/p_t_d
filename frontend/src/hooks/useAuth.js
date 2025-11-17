import { useCallback, useState } from 'react';
import { login as loginService, getCurrentUser } from '../services/auth';

const parseErrorMessage = (error) => {
  if (error?.response?.data?.detail) return error.response.data.detail;
  if (error?.message) return error.message;
  return 'Ocurrió un error al comunicarse con el servidor.';
};

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginService({ email, password });
      if (!data?.access_token) {
        throw new Error('Token no recibido');
      }

      localStorage.setItem('access_token', data.access_token);
      if (data?.token_type) {
        localStorage.setItem('token_type', data.token_type);
      }

      if (rememberMe && email) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      return data;
    } catch (err) {
      const message = parseErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const data = await getCurrentUser();
      return data;
    } catch (err) {
      const message = parseErrorMessage(err);
      setError(message);
      throw err;
    }
  }, []);

  return { login, fetchCurrentUser, loading, error };
};

export default useAuth;
