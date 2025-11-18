import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AudioAlertTester = ({ 
  isCapacityExceeded = false, 
  currentCount = 0, 
  maxCapacity = 50,
  onAlertTest 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [alertType, setAlertType] = useState('warning');
  const [isEnabled, setIsEnabled] = useState(true);
  const audioRef = useRef(null);
  const alertTimeoutRef = useRef(null);
  const hasExceededRef = useRef(false);


  // Mock audio sources for different alert types
  const alertSounds = {
    warning: '/audio/warning-beep.wav',
    critical: '/audio/critical-alarm.wav',
    voice: '/audio/voice-alert.wav'
  };

  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
      setIsPlaying(false);
    }
  }, [alertType]);


  useEffect(() => {
    // Solo disparar cuando:
    // - Está habilitado
    // - Se acaba de pasar de "no excedido" -> "excedido"
    if (isEnabled && isCapacityExceeded && !hasExceededRef.current) {
      triggerAlert();
    }

    // Actualizar el estado previo del umbral
    if (!isCapacityExceeded) {
      hasExceededRef.current = false;
    } else {
      hasExceededRef.current = true;
    }
  }, [isCapacityExceeded, isEnabled]);

  const triggerAlert = () => {
    if (!isEnabled || isPlaying) return;

    setIsPlaying(true);
    onAlertTest?.(true, currentCount, maxCapacity);

    // Simulate audio playback
    if (audioRef?.current) {
      audioRef.current.volume = volume;
      audioRef?.current?.play()?.catch(console.error);
    }

    // Auto-stop after 3 seconds
    alertTimeoutRef.current = setTimeout(() => {
      stopAlert();
    }, 3000);
  };

  const stopAlert = () => {
    setIsPlaying(false);
    onAlertTest?.(false, currentCount, maxCapacity);
    
    if (audioRef?.current) {
      audioRef?.current?.pause();
      audioRef.current.currentTime = 0;
    }

    if (alertTimeoutRef?.current) {
      clearTimeout(alertTimeoutRef?.current);
    }
  };

  const testAlert = () => {
    if (isPlaying) {
      stopAlert();
    } else {
      triggerAlert();
    }
  };

  const getAlertDescription = (type) => {
    switch (type) {
      case 'warning':
        return 'Tono de advertencia suave para alertas tempranas';
      case 'critical':
        return 'Alarma crítica para sobrecapacidad severa';
      case 'voice':
        return 'Alerta de voz con instrucciones claras';
      default:
        return 'Alerta estándar del sistema';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return 'AlertTriangle';
      case 'critical':
        return 'AlertOctagon';
      case 'voice':
        return 'MessageSquare';
      default:
        return 'Bell';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Volume2" size={20} className="text-primary" />
          <span>Prueba de Alertas de Audio</span>
        </h3>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Habilitado:</span>
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isEnabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      {/* Current Status */}
      <div className={`rounded-lg p-4 ${
        isCapacityExceeded ? 'bg-error/10 border border-error/20' : 'bg-success/10 border border-success/20'
      }`}>
        <div className="flex items-center space-x-3">
          <Icon 
            name={isCapacityExceeded ? "AlertTriangle" : "CheckCircle"} 
            size={20} 
            className={isCapacityExceeded ? "text-error" : "text-success"}
          />
          <div>
            <div className="font-medium text-foreground">
              {isCapacityExceeded ? 'Capacidad Excedida' : 'Capacidad Normal'}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentCount} de {maxCapacity} pasajeros ({Math.round((currentCount / maxCapacity) * 100)}%)
            </div>
          </div>
          {isPlaying && (
            <div className="flex items-center space-x-2 text-error">
              <div className="animate-pulse">
                <Icon name="Volume2" size={16} />
              </div>
              <span className="text-sm font-medium">Reproduciendo Alerta</span>
            </div>
          )}
        </div>
      </div>
      {/* Alert Type Selection */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Tipo de Alerta</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.keys(alertSounds)?.map((type) => (
            <button
              key={type}
              onClick={() => setAlertType(type)}
              className={`p-3 rounded-lg border text-left transition-all ${
                alertType === type
                  ? 'border-primary bg-primary/10 text-primary' :'border-border bg-card hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon name={getAlertIcon(type)} size={16} />
                <span className="font-medium capitalize">{type}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {getAlertDescription(type)}
              </p>
            </button>
          ))}
        </div>
      </div>
      {/* Volume Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">Volumen</h4>
          <span className="text-sm text-muted-foreground">{Math.round(volume * 100)}%</span>
        </div>
        <div className="flex items-center space-x-3">
          <Icon name="VolumeX" size={16} className="text-muted-foreground" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e?.target?.value))}
            className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <Icon name="Volume2" size={16} className="text-muted-foreground" />
        </div>
      </div>
      {/* Test Controls */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <Button
          variant={isPlaying ? "destructive" : "default"}
          onClick={testAlert}
          disabled={!isEnabled}
          iconName={isPlaying ? "Square" : "Play"}
          iconPosition="left"
          className="flex-1"
        >
          {isPlaying ? 'Detener Alerta' : 'Probar Alerta'}
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            // Simulate capacity exceeded for testing
            const testCount = maxCapacity + 5;
            onAlertTest?.(true, testCount, maxCapacity);
            setTimeout(() => {
              onAlertTest?.(false, testCount, maxCapacity);
            }, 2000);
          }}
          disabled={!isEnabled || isPlaying}
          iconName="Zap"
          iconPosition="left"
        >
          Simular Exceso
        </Button>
      </div>
      {/* Alert History */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
          <Icon name="History" size={16} />
          <span>Historial de Alertas</span>
        </h4>
        
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {[
            { time: '18:20:45', type: 'warning', count: 52, triggered: true },
            { time: '18:19:32', type: 'critical', count: 58, triggered: true },
            { time: '18:18:15', type: 'warning', count: 51, triggered: true },
            { time: '18:17:03', type: 'voice', count: 55, triggered: true }
          ]?.map((alert, index) => (
            <div 
              key={index}
              className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded"
            >
              <div className="flex items-center space-x-2">
                <Icon name={getAlertIcon(alert?.type)} size={14} className="text-warning" />
                <span className="font-mono">{alert?.time}</span>
                <span className="capitalize">{alert?.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{alert?.count} pasajeros</span>
                <div className="w-2 h-2 bg-error rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => setIsPlaying(false)}
      >
        <source src={alertSounds?.[alertType]} type="audio/wav" />
        Su navegador no soporta el elemento de audio.
      </audio>
    </div>
  );
};

export default AudioAlertTester;