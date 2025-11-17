import React from 'react';
import Icon from '../../../components/AppIcon';

const BusStatusGrid = ({ buses, onViewDetails, onViewHistory }) => {
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

  if (buses?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center shadow-card">
        <Icon name="Bus" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron autobuses</h3>
        <p className="text-muted-foreground">
          No hay autobuses que coincidan con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Vehículo</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Ruta</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Ocupación</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Porcentaje</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Estado</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Ubicación</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Última Act.</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {buses?.map((bus) => {
              const occupancyPercentage = Math.round((bus?.currentOccupancy / bus?.maxCapacity) * 100);
              
              return (
                <tr key={bus?.id} className="hover:bg-muted/30 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                        <Icon name="Bus" size={16} className="text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{bus?.vehicleId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">{bus?.routeNumber}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-foreground">
                        {bus?.currentOccupancy}/{bus?.maxCapacity}
                      </div>
                      <div className="w-20 bg-muted rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            occupancyPercentage >= 90 ? 'bg-error' :
                            occupancyPercentage >= 75 ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${getStatusColor(occupancyPercentage)}`}>
                      {occupancyPercentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${getStatusBgColor(occupancyPercentage)}`}>
                      <Icon name={getStatusIcon(occupancyPercentage)} size={12} className={getStatusColor(occupancyPercentage)} />
                      <span className={`text-xs font-medium ${getStatusColor(occupancyPercentage)}`}>
                        {bus?.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{bus?.currentLocation}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{bus?.lastUpdate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewDetails(bus)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors duration-200"
                        title="Ver detalles"
                      >
                        <Icon name="Eye" size={16} />
                      </button>
                      <button
                        onClick={() => onViewHistory(bus)}
                        className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors duration-200"
                        title="Ver historial"
                      >
                        <Icon name="History" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {buses?.map((bus) => {
          const occupancyPercentage = Math.round((bus?.currentOccupancy / bus?.maxCapacity) * 100);
          
          return (
            <div key={bus?.id} className="p-4">
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
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ocupación</span>
                  <span className="font-medium text-foreground">
                    {bus?.currentOccupancy}/{bus?.maxCapacity} ({occupancyPercentage}%)
                  </span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      occupancyPercentage >= 90 ? 'bg-error' :
                      occupancyPercentage >= 75 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ubicación</span>
                  <span className="text-foreground">{bus?.currentLocation}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Actualizado</span>
                  <span className="text-foreground">{bus?.lastUpdate}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onViewDetails(bus)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors duration-200"
                >
                  <Icon name="Eye" size={14} />
                  <span>Detalles</span>
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
        })}
      </div>
    </div>
  );
};

export default BusStatusGrid;