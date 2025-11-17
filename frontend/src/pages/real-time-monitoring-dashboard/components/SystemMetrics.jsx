import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemMetrics = ({ metrics }) => {
  const metricCards = [
    {
      title: 'Autobuses Activos',
      value: metrics?.totalActiveBuses,
      icon: 'Bus',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+2',
      changeType: 'increase'
    },
    {
      title: 'Ocupación Promedio',
      value: `${metrics?.averageOccupancy}%`,
      icon: 'Users',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Alertas de Capacidad',
      value: metrics?.capacityAlerts,
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: '-3',
      changeType: 'decrease'
    },
    {
      title: 'Rutas Monitoreadas',
      value: metrics?.totalRoutes,
      icon: 'Route',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: '0',
      changeType: 'neutral'
    }
  ];

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'increase': return 'text-success';
      case 'decrease': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'increase': return 'TrendingUp';
      case 'decrease': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards?.map((metric, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 shadow-card hover:shadow-elevated transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${metric?.bgColor}`}>
              <Icon name={metric?.icon} size={20} className={metric?.color} />
            </div>
            <div className={`flex items-center space-x-1 ${getChangeColor(metric?.changeType)}`}>
              <Icon name={getChangeIcon(metric?.changeType)} size={12} />
              <span className="text-xs font-medium">{metric?.change}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">{metric?.value}</h3>
            <p className="text-sm text-muted-foreground">{metric?.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemMetrics;