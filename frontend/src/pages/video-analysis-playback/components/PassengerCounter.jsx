import React from 'react';
import Icon from '../../../components/AppIcon';

const PassengerCounter = ({ 
  currentCount = 0, 
  maxCapacity = 50, 
  confidence = 0, 
  timestamp = 0,
  detectionHistory = []
}) => {
  const capacityPercentage = (currentCount / maxCapacity) * 100;
  const isOverCapacity = currentCount > maxCapacity;
  
  const getStatusColor = () => {
    if (isOverCapacity) return 'text-error';
    if (capacityPercentage > 80) return 'text-warning';
    return 'text-success';
  };

  const getStatusBgColor = () => {
    if (isOverCapacity) return 'bg-error/10';
    if (capacityPercentage > 80) return 'bg-warning/10';
    return 'bg-success/10';
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds?.toString()?.padStart(2, '0')}`;
  };

  const getConfidenceColor = (conf) => {
    if (conf >= 0.8) return 'text-success';
    if (conf >= 0.6) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Users" size={20} className="text-primary" />
          <span>Contador de Pasajeros</span>
        </h3>
        <div className="text-sm text-muted-foreground font-mono">
          {formatTime(timestamp)}
        </div>
      </div>
      {/* Main Counter Display */}
      <div className={`${getStatusBgColor()} rounded-lg p-6 text-center space-y-4`}>
        <div className="space-y-2">
          <div className={`text-4xl font-bold ${getStatusColor()}`}>
            {currentCount}
          </div>
          <div className="text-sm text-muted-foreground">
            de {maxCapacity} pasajeros máximo
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="space-y-2">
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isOverCapacity ? 'bg-error' : 
                capacityPercentage > 80 ? 'bg-warning' : 'bg-success'
              }`}
              style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span className={getStatusColor()}>
              {Math.round(capacityPercentage)}%
            </span>
            <span>{maxCapacity}</span>
          </div>
        </div>

        {/* Status Alert */}
        {isOverCapacity && (
          <div className="flex items-center justify-center space-x-2 text-error">
            <Icon name="AlertTriangle" size={16} />
            <span className="text-sm font-medium">
              ¡Capacidad Excedida!
            </span>
          </div>
        )}
      </div>
      {/* Detection Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className={`text-2xl font-bold ${getConfidenceColor(confidence)}`}>
            {Math.round(confidence * 100)}%
          </div>
          <div className="text-sm text-muted-foreground">Confianza</div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {detectionHistory?.length}
          </div>
          <div className="text-sm text-muted-foreground">Detecciones</div>
        </div>
      </div>
      {/* Recent Detection History */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
          <Icon name="History" size={16} />
          <span>Historial Reciente</span>
        </h4>
        
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {detectionHistory?.slice(-5)?.reverse()?.map((detection, index) => (
            <div 
              key={index}
              className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  detection?.count > maxCapacity ? 'bg-error' : 'bg-success'
                }`} />
                <span className="font-mono">{formatTime(detection?.timestamp)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-medium">{detection?.count} personas</span>
                <span className={`text-xs ${getConfidenceColor(detection?.confidence)}`}>
                  {Math.round(detection?.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
          
          {detectionHistory?.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-4">
              No hay detecciones disponibles
            </div>
          )}
        </div>
      </div>
      {/* Capacity Threshold Indicator */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Umbral de Capacidad:</span>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full" />
            <span>80% ({Math.round(maxCapacity * 0.8)})</span>
            <div className="w-3 h-3 bg-error rounded-full ml-3" />
            <span>100% ({maxCapacity})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerCounter;