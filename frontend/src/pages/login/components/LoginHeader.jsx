import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center space-y-6 mb-8">
      {/* Logo Section */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-elevated">
            <Icon name="Bus" size={28} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground">
              Cpatbus
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              Sistema de Monitoreo de Transporte
            </p>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Bienvenido de Vuelta
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Acceda al sistema de monitoreo de capacidad de autobuses en tiempo real. 
          Ingrese sus credenciales para continuar.
        </p>
      </div>

      {/* System Status Indicator */}
      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-success/10 rounded-full">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse-status"></div>
        <span className="text-sm font-medium text-success">Sistema Operativo</span>
      </div>
    </div>
  );
};

export default LoginHeader;