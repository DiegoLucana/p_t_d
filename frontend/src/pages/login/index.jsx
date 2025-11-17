import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginFooter from './components/LoginFooter';
import Icon from '../../components/AppIcon';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSystemReady, setIsSystemReady] = useState(false);

  // Simulate system initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSystemReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (formData) => {
    setLoading(true);
    setError('');

    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock role-based routing
      const roleRoutes = {
        'admin@busflow.com': '/real-time-monitoring-dashboard',
        'operador@busflow.com': '/real-time-monitoring-dashboard',
        'calidad@busflow.com': '/validation-laboratory'
      };

      const redirectRoute = roleRoutes?.[formData?.email] || '/real-time-monitoring-dashboard';

      // Store user session (mock)
      localStorage.setItem('busflow_user', JSON.stringify({
        email: formData?.email,
        role: formData?.email?.includes('admin') ? 'admin' : 
              formData?.email?.includes('operador') ? 'operator' : 'qa',
        loginTime: new Date()?.toISOString(),
        rememberMe: formData?.rememberMe
      }));

      // Navigate to appropriate dashboard
      navigate(redirectRoute);

    } catch (err) {
      setError('Error de conexión. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isSystemReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl shadow-elevated animate-pulse">
            <Icon name="Bus" size={32} color="white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Iniciando Sistema
            </h2>
            <p className="text-sm text-muted-foreground">
              Conectando con servidores de monitoreo...
            </p>
          </div>
          <div className="flex justify-center space-x-1">
            {[0, 1, 2]?.map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Main Login Container */}
      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl shadow-floating p-8 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
          
          {/* Content */}
          <div className="relative z-10">
            <LoginHeader />
            <LoginForm 
              onSubmit={handleLogin}
              loading={loading}
              error={error}
            />
            <LoginFooter />
          </div>
        </div>

        {/* Additional System Info */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-card/80 backdrop-blur-sm border border-border rounded-full">
            <Icon name="Wifi" size={14} className="text-success" />
            <span className="text-xs text-muted-foreground">
              Conectado a Red Segura
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="fixed bottom-4 right-4">
        <button className="flex items-center space-x-2 px-4 py-2 bg-card border border-border rounded-lg shadow-card hover:shadow-elevated transition-all duration-200 text-sm text-muted-foreground hover:text-foreground">
          <Icon name="Phone" size={14} />
          <span className="hidden sm:inline">Emergencia: +51 967 731 175</span>
          <span className="sm:hidden">Emergencia</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;