// frontend/src/pages/login/components/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/apiClient';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LoginForm = () => {
  const navigate = useNavigate();

  // Puedes dejar estos hardcodeados para probar más rápido
  const [email, setEmail] = useState('diegolucana@cpatbus.com');
  const [password, setPassword] = useState('cpatbus123');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // ⚠️ Importante: FastAPI espera "username" y "password" en form-data
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await apiClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, token_type } = response.data || {};
      if (!access_token) {
        throw new Error('Respuesta inválida del servidor');
      }

      // Guardamos el token para que apiClient lo inyecte en el Authorization
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('token_type', token_type || 'bearer');

      // (Opcional) podríamos traer datos del usuario con /auth/me aquí

      // Redirigir al dashboard principal
      navigate('/real-time-monitoring-dashboard');
    } catch (error) {
      console.error('Error en login:', error);
      let message = 'Error al iniciar sesión. Verifica tus credenciales.';

      if (error?.response?.data?.detail) {
        message = error.response.data.detail;
      }

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {errorMessage && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">
          Correo electrónico
        </label>
        <Input
          type="email"
          placeholder="tucorreo@cpatbus.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">
          Contraseña
        </label>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full justify-center mt-2"
        iconName="LogIn"
        iconPosition="left"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-2">
        Usuario demo:&nbsp;
        <span className="font-mono">diegolucana@cpatbus.com</span>
        &nbsp;/&nbsp;
        <span className="font-mono">cpatbus123</span>
      </p>
    </form>
  );
};

export default LoginForm;
