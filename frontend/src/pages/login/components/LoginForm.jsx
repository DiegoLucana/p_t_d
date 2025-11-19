// frontend/src/pages/login/components/LoginForm.jsx
import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LoginForm = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = useState(() => localStorage.getItem('remembered_email') || 'diegolucana@cpatbus.com');
  const [password, setPassword] = useState('cpatbus123');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (onSubmit) {
      await onSubmit({ email, password, rememberMe });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
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
          autoComplete="off"
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
          autoComplete="off"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="rememberMe"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        <label htmlFor="rememberMe" className="text-sm text-foreground">Recordarme</label>
      </div>

      <Button
        type="submit"
        className="w-full justify-center mt-2"
        iconName="LogIn"
        iconPosition="left"
        disabled={loading}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>


    </form>
  );
};

export default LoginForm;
