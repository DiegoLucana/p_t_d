import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginFooter = () => {
  const currentYear = new Date()?.getFullYear();

  return (
    <div className="mt-8 space-y-6">
      {/* Security Notice */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={18} className="text-primary mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-foreground">
              Conexión Segura
            </h4>
            <p className="text-xs text-muted-foreground">
              Su sesión está protegida con cifrado SSL y autenticación JWT. 
              Todas las comunicaciones son monitoreadas por seguridad.
            </p>
          </div>
        </div>
      </div>

      {/* Support Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
        <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors duration-200">
          <Icon name="HelpCircle" size={14} />
          <span>Centro de Ayuda</span>
        </button>
        
        <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors duration-200">
          <Icon name="Phone" size={14} />
          <span>Soporte Técnico</span>
        </button>
        
        <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors duration-200">
          <Icon name="FileText" size={14} />
          <span>Documentación</span>
        </button>
      </div>

      {/* Copyright */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {currentYear} Cpatbus. Todos los derechos reservados.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Sistema de Monitoreo de Transporte Público v2.1.0
        </p>
      </div>
    </div>
  );
};

export default LoginFooter;