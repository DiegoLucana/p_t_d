import React from 'react';
import Icon from '../../../components/AppIcon';

const ProcessingStatus = ({ 
  isProcessing, 
  progress = 0, 
  stage = 'Preparando análisis...', 
  estimatedTime = null,
  onCancel 
}) => {
  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (!isProcessing) return null;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Estado del Procesamiento</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-destructive transition-colors"
            title="Cancelar procesamiento"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Progreso</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-300 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Current Stage */}
        <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
          <div className="flex-shrink-0">
            <Icon name="Loader2" size={20} className="text-primary animate-spin" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{stage}</p>
            {estimatedTime && (
              <p className="text-xs text-muted-foreground mt-1">
                Tiempo estimado restante: {formatTime(estimatedTime)}
              </p>
            )}
          </div>
        </div>

        {/* Processing Stages */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Etapas de Procesamiento</h4>
          <div className="space-y-2">
            {[
              { name: 'Carga de video', completed: progress > 10 },
              { name: 'Análisis de frames', completed: progress > 30 },
              { name: 'Detección de personas', completed: progress > 60 },
              { name: 'Validación de resultados', completed: progress > 85 },
              { name: 'Generación de reporte', completed: progress >= 100 }
            ]?.map((stage, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  stage?.completed 
                    ? 'bg-success text-success-foreground' 
                    : progress > (index * 20) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stage?.completed ? (
                    <Icon name="Check" size={10} />
                  ) : progress > (index * 20) ? (
                    <Icon name="Loader2" size={10} className="animate-spin" />
                  ) : (
                    <span className="w-2 h-2 bg-current rounded-full" />
                  )}
                </div>
                <span className={`text-sm ${
                  stage?.completed 
                    ? 'text-success font-medium' 
                    : progress > (index * 20)
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                }`}>
                  {stage?.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {Math.round(progress * 0.8)}
            </div>
            <div className="text-xs text-muted-foreground">Frames procesados</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {Math.round(progress * 0.3)}
            </div>
            <div className="text-xs text-muted-foreground">Personas detectadas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;