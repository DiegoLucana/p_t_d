import React from 'react';
import Icon from '../../../components/AppIcon';

const BusStatusCard = ({ bus, onViewDetails, onViewHistory }) => {
  const getStatusColor = (occupancyPercentage) => {
    if (occupancyPercentage >= 90) return 'text-error';
    if (occupancyPercentage >= 75) return 'text-warning';
    return 'text-success';
  };

  const getStatusBgColor = (occupancyPercentage) => {
    if (occupancyPercentage >= 90) return 'bg-error/10';
    if (occupancyPercentage >= 75) return 'bg-warning/10';
    return 'bg-success/10';
  };

  const getStatusIcon = (occupancyPercentage) => {
    if (occupancyPercentage >= 90) return 'AlertTriangle';
    if (occupancyPercentage >= 75) return 'AlertCircle';
    return 'CheckCircle';
  };

  const occupancyPercentage = Math.round((bus?.currentOccupancy / bus?.maxCapacity) * 100);

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card hover:shadow-elevated transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
            <Icon name="Bus" size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{bus?.vehicleId}</h3>
            <p className="text-sm text-muted-foreground">Ruta {bus?.routeNumber}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getStatusBgColor(occupancyPercentage)}`}>
          <Icon name={getStatusIcon(occupancyPercentage)} size={12} className={getStatusColor(occupancyPercentage)} />
          <span className={`text-xs font-medium ${getStatusColor(occupancyPercentage)}`}>
            {bus?.status}
          </span>
        </div>
      </div>
      {/* Occupancy Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Ocupación Actual</span>
          <span className="font-semibold text-foreground">
            {bus?.currentOccupancy}/{bus?.maxCapacity}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              occupancyPercentage >= 90 ? 'bg-error' :
              occupancyPercentage >= 75 ? 'bg-warning' : 'bg-success'
            }`}
            style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Porcentaje</span>
          <span className={`font-semibold ${getStatusColor(occupancyPercentage)}`}>
            {occupancyPercentage}%
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="MapPin" size={14} />
          <span>{bus?.currentLocation}</span>
        </div>

        {/* Last Update */}
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Clock" size={12} />
          <span>Actualizado: {bus?.lastUpdate}</span>
        </div>
      </div>
      {/* Actions */}
      <div className="flex space-x-2 mt-4 pt-3 border-t border-border">
        <button
          onClick={() => onViewDetails(bus)}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors duration-200"
        >
          <Icon name="Eye" size={14} />
          <span>Ver Detalles</span>
        </button>
        <button
          onClick={() => onViewHistory(bus)}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors duration-200"
        >
          <Icon name="History" size={14} />
          <span>Historial</span>
        </button>
      </div>
    </div>
  );
};

export default BusStatusCard;