import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ValidationSessionsTable = ({ sessions = [], onViewResults, onReprocess, onExport }) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSessions = [...sessions]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (sortField === 'date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'failed': return 'text-destructive';
      case 'processing': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'failed': return 'XCircle';
      case 'processing': return 'Loader2';
      default: return 'Clock';
    }
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return 'text-success';
    if (accuracy >= 75) return 'text-warning';
    return 'text-destructive';
  };

  if (sessions?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Icon name="FileVideo" size={24} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No hay sesiones de validación
            </h3>
            <p className="text-sm text-muted-foreground">
              Sube un video para comenzar tu primera sesión de validación
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Sesiones de Validación Recientes</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => onExport && onExport('all')}
            >
              Exportar Todo
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('filename')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Archivo</span>
                  <Icon 
                    name={sortField === 'filename' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Fecha</span>
                  <Icon 
                    name={sortField === 'date' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('detectedCount')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Personas Detectadas</span>
                  <Icon 
                    name={sortField === 'detectedCount' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('accuracy')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Precisión</span>
                  <Icon 
                    name={sortField === 'accuracy' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-foreground">Estado</span>
              </th>
              <th className="text-right p-4">
                <span className="text-sm font-medium text-foreground">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSessions?.map((session, index) => (
              <tr key={session?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                      <Icon name="FileVideo" size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground truncate max-w-[200px]">
                        {session?.filename}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {session?.duration} • {session?.fileSize}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">
                    {new Date(session.date)?.toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(session.date)?.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-foreground">
                    {session?.detectedCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Máx: {session?.maxCapacity}
                  </div>
                </td>
                <td className="p-4">
                  <div className={`text-sm font-medium ${getAccuracyColor(session?.accuracy)}`}>
                    {session?.accuracy}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Confianza: {session?.confidence}%
                  </div>
                </td>
                <td className="p-4">
                  <div className={`flex items-center space-x-2 ${getStatusColor(session?.status)}`}>
                    <Icon 
                      name={getStatusIcon(session?.status)} 
                      size={16} 
                      className={session?.status === 'processing' ? 'animate-spin' : ''} 
                    />
                    <span className="text-sm capitalize">
                      {session?.status === 'completed' ? 'Completado' :
                       session?.status === 'failed' ? 'Fallido' :
                       session?.status === 'processing' ? 'Procesando' : 'Pendiente'}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    {session?.status === 'completed' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Eye"
                          onClick={() => onViewResults && onViewResults(session?.id)}
                          title="Ver resultados"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Download"
                          onClick={() => onExport && onExport(session?.id)}
                          title="Exportar reporte"
                        />
                      </>
                    )}
                    {(session?.status === 'completed' || session?.status === 'failed') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="RefreshCw"
                        onClick={() => onReprocess && onReprocess(session?.id)}
                        title="Reprocesar"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValidationSessionsTable;