import React from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionStatus = ({ isConnected, lastUpdate, dataSource }) => {
  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-lg p-3 shadow-card">
      <div className="flex items-center space-x-3">
        {/* Connection Indicator */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-success animate-pulse-status' : 'bg-error'}`} />
          <span className={`text-sm font-medium ${isConnected ? 'text-success' : 'text-error'}`}>
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>

        {/* Data Source */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name={dataSource === 'websocket' ? 'Wifi' : 'Database'} size={14} />
          <span>
            {dataSource === 'websocket' ? 'Datos en Tiempo Real' : 'Datos de Prueba'}
          </span>
        </div>
      </div>

      {/* Last Update */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Icon name="RefreshCw" size={14} />
        <span>Última actualización: {lastUpdate}</span>
      </div>
    </div>
  );
};

export default ConnectionStatus;