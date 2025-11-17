import React from 'react';
import Icon from '../../../components/AppIcon';

const AlertsPanel = ({ alerts, onDismissAlert, onViewBus }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'capacity': return 'AlertTriangle';
      case 'offline': return 'WifiOff';
      case 'maintenance': return 'Wrench';
      default: return 'AlertCircle';
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getAlertBgColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-error/10 border-error/20';
      case 'warning': return 'bg-warning/10 border-warning/20';
      case 'info': return 'bg-accent/10 border-accent/20';
      default: return 'bg-muted/10 border-border';
    }
  };

  if (alerts?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center shadow-card">
        <Icon name="CheckCircle" size={32} className="mx-auto text-success mb-3" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Sin Alertas Activas</h3>
        <p className="text-muted-foreground">
          Todos los autobuses están operando dentro de los parámetros normales.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Bell" size={20} className="text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Alertas Activas</h3>
          <div className="flex items-center justify-center w-6 h-6 bg-error text-error-foreground rounded-full text-xs font-bold">
            {alerts?.length}
          </div>
        </div>
        
        {alerts?.length > 0 && (
          <button
            onClick={() => alerts?.forEach(alert => onDismissAlert(alert?.id))}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Descartar Todas
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        <div className="divide-y divide-border">
          {alerts?.map((alert) => (
            <div key={alert?.id} className={`p-4 border-l-4 ${getAlertBgColor(alert?.severity)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Icon 
                    name={getAlertIcon(alert?.type)} 
                    size={20} 
                    className={`mt-0.5 ${getAlertColor(alert?.severity)}`} 
                  />
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-foreground">{alert?.title}</h4>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        alert?.severity === 'critical' ? 'bg-error/20 text-error' :
                        alert?.severity === 'warning'? 'bg-warning/20 text-warning' : 'bg-accent/20 text-accent'
                      }`}>
                        {alert?.severity === 'critical' ? 'Crítico' :
                         alert?.severity === 'warning' ? 'Advertencia' : 'Info'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{alert?.message}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="Bus" size={12} />
                        <span>{alert?.vehicleId}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Route" size={12} />
                        <span>Ruta {alert?.routeNumber}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} />
                        <span>{alert?.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {alert?.vehicleId && (
                    <button
                      onClick={() => onViewBus(alert?.vehicleId)}
                      className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors duration-200"
                      title="Ver autobús"
                    >
                      <Icon name="Eye" size={14} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => onDismissAlert(alert?.id)}
                    className="p-1.5 text-muted-foreground hover:bg-muted rounded-md transition-colors duration-200"
                    title="Descartar alerta"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;