import React, { useState } from 'react';

import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ConfigurationPanel = ({ onConfigurationChange, isProcessing }) => {
  const [config, setConfig] = useState({
    maxCapacity: 50,
    detectionSensitivity: 75,
    confidenceThreshold: 80,
    alertEnabled: true,
    alertVolume: 70,
    processingMode: 'standard',
    enableFaceDetection: true,
    enableBodyDetection: true,
    minPersonSize: 30,
    maxPersonSize: 200
  });

  const handleConfigChange = (field, value) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    onConfigurationChange(newConfig);
  };

  const resetToDefaults = () => {
    const defaultConfig = {
      maxCapacity: 50,
      detectionSensitivity: 75,
      confidenceThreshold: 80,
      alertEnabled: true,
      alertVolume: 70,
      processingMode: 'standard',
      enableFaceDetection: true,
      enableBodyDetection: true,
      minPersonSize: 30,
      maxPersonSize: 200
    };
    setConfig(defaultConfig);
    onConfigurationChange(defaultConfig);
  };

  const testAlert = () => {
    // Simulate alert sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhB');
    audio.volume = config.alertVolume / 100;
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Configuración de Análisis</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={resetToDefaults}
          iconName="RotateCcw"
          iconPosition="left"
          disabled={isProcessing}
        >
          Restablecer
        </Button>
      </div>

      <div className="space-y-6">
        {/* Capacity Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Configuración de Capacidad</h4>
          
          <Input
            label="Capacidad Máxima"
            type="number"
            value={config.maxCapacity}
            onChange={(e) => handleConfigChange('maxCapacity', parseInt(e.target.value) || 0)}
            description="Número máximo de pasajeros permitidos"
            min={1}
            max={200}
            disabled={isProcessing}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Sensibilidad de Detección: {config.detectionSensitivity}%
            </label>
            <input
              type="range"
              min={25}
              max={100}
              step={5}
              value={config.detectionSensitivity}
              onChange={(e) => handleConfigChange('detectionSensitivity', parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              disabled={isProcessing}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Baja</span>
              <span>Media</span>
              <span>Alta</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Umbral de Confianza: {config.confidenceThreshold}%
            </label>
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={config.confidenceThreshold}
              onChange={(e) => handleConfigChange('confidenceThreshold', parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground">
              Nivel mínimo de confianza para considerar una detección válida
            </p>
          </div>
        </div>

        {/* Detection Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Configuración de Detección</h4>
          
          <div className="grid grid-cols-1 gap-3">
            <Checkbox
              label="Detección de Rostros"
              checked={config.enableFaceDetection}
              onChange={(e) => handleConfigChange('enableFaceDetection', e.target.checked)}
              description="Utilizar reconocimiento facial para conteo"
              disabled={isProcessing}
            />
            
            <Checkbox
              label="Detección de Cuerpos"
              checked={config.enableBodyDetection}
              onChange={(e) => handleConfigChange('enableBodyDetection', e.target.checked)}
              description="Utilizar detección de siluetas corporales"
              disabled={isProcessing}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tamaño Mínimo"
              type="number"
              value={config.minPersonSize}
              onChange={(e) => handleConfigChange('minPersonSize', parseInt(e.target.value) || 0)}
              description="Píxeles mínimos"
              min={10}
              max={100}
              disabled={isProcessing}
            />
            
            <Input
              label="Tamaño Máximo"
              type="number"
              value={config.maxPersonSize}
              onChange={(e) => handleConfigChange('maxPersonSize', parseInt(e.target.value) || 0)}
              description="Píxeles máximos"
              min={100}
              max={500}
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Alert Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Configuración de Alertas</h4>
          
          <Checkbox
            label="Habilitar Alertas de Capacidad"
            checked={config.alertEnabled}
            onChange={(e) => handleConfigChange('alertEnabled', e.target.checked)}
            description="Reproducir alerta cuando se exceda la capacidad máxima"
            disabled={isProcessing}
          />

          {config.alertEnabled && (
            <div className="space-y-3 pl-6 border-l-2 border-primary/20">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Volumen de Alerta: {config.alertVolume}%
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={10}
                  value={config.alertVolume}
                  onChange={(e) => handleConfigChange('alertVolume', parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  disabled={isProcessing}
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={testAlert}
                iconName="Volume2"
                iconPosition="left"
                disabled={isProcessing}
              >
                Probar Alerta
              </Button>
            </div>
          )}
        </div>

        {/* Processing Mode */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Modo de Procesamiento</h4>
          
          <div className="grid grid-cols-1 gap-2">
            {[
              { value: 'fast', label: 'Rápido', desc: 'Procesamiento acelerado, menor precisión' },
              { value: 'standard', label: 'Estándar', desc: 'Balance entre velocidad y precisión' },
              { value: 'accurate', label: 'Preciso', desc: 'Máxima precisión, procesamiento más lento' }
            ].map((mode) => (
              <label
                key={mode.value}
                className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  config.processingMode === mode.value
                    ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="processingMode"
                  value={mode.value}
                  checked={config.processingMode === mode.value}
                  onChange={(e) => handleConfigChange('processingMode', e.target.value)}
                  className="mt-1"
                  disabled={isProcessing}
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{mode.label}</div>
                  <div className="text-xs text-muted-foreground">{mode.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;