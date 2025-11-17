import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const DetectionStatistics = ({ 
  detectionData = [],
  accuracyMetrics = {},
  validationResults = {}
}) => {
  // Mock statistics data
  const statisticsData = [
    { time: '00:00', detected: 12, manual: 12, accuracy: 100 },
    { time: '00:30', detected: 18, manual: 17, accuracy: 94 },
    { time: '01:00', detected: 25, manual: 24, accuracy: 96 },
    { time: '01:30', detected: 32, manual: 31, accuracy: 97 },
    { time: '02:00', detected: 28, manual: 29, accuracy: 97 },
    { time: '02:30', detected: 35, manual: 33, accuracy: 94 },
    { time: '03:00', detected: 42, manual: 41, accuracy: 98 },
    { time: '03:30', detected: 38, manual: 39, accuracy: 97 }
  ];

  const performanceMetrics = {
    overallAccuracy: 96.2,
    falsePositiveRate: 3.1,
    falseNegativeRate: 2.7,
    averageConfidence: 87.4,
    processingTime: 2.3,
    totalDetections: 1247,
    validDetections: 1199,
    invalidDetections: 48
  };

  const getMetricColor = (value, thresholds) => {
    if (value >= thresholds?.good) return 'text-success';
    if (value >= thresholds?.warning) return 'text-warning';
    return 'text-error';
  };

  const getMetricBgColor = (value, thresholds) => {
    if (value >= thresholds?.good) return 'bg-success/10';
    if (value >= thresholds?.warning) return 'bg-warning/10';
    return 'bg-error/10';
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <span>Métricas de Rendimiento</span>
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Overall Accuracy */}
          <div className={`${getMetricBgColor(performanceMetrics?.overallAccuracy, { good: 95, warning: 85 })} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${getMetricColor(performanceMetrics?.overallAccuracy, { good: 95, warning: 85 })}`}>
              {performanceMetrics?.overallAccuracy}%
            </div>
            <div className="text-sm text-muted-foreground">Precisión General</div>
          </div>

          {/* False Positive Rate */}
          <div className={`${getMetricBgColor(100 - performanceMetrics?.falsePositiveRate, { good: 95, warning: 90 })} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${getMetricColor(100 - performanceMetrics?.falsePositiveRate, { good: 95, warning: 90 })}`}>
              {performanceMetrics?.falsePositiveRate}%
            </div>
            <div className="text-sm text-muted-foreground">Falsos Positivos</div>
          </div>

          {/* False Negative Rate */}
          <div className={`${getMetricBgColor(100 - performanceMetrics?.falseNegativeRate, { good: 95, warning: 90 })} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${getMetricColor(100 - performanceMetrics?.falseNegativeRate, { good: 95, warning: 90 })}`}>
              {performanceMetrics?.falseNegativeRate}%
            </div>
            <div className="text-sm text-muted-foreground">Falsos Negativos</div>
          </div>

          {/* Average Confidence */}
          <div className={`${getMetricBgColor(performanceMetrics?.averageConfidence, { good: 85, warning: 70 })} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${getMetricColor(performanceMetrics?.averageConfidence, { good: 85, warning: 70 })}`}>
              {performanceMetrics?.averageConfidence}%
            </div>
            <div className="text-sm text-muted-foreground">Confianza Promedio</div>
          </div>
        </div>
      </div>
      {/* Detection Accuracy Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <span>Comparación de Detección vs Manual</span>
        </h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statisticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="detected" fill="var(--color-primary)" name="Detectado" />
              <Bar dataKey="manual" fill="var(--color-accent)" name="Manual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Accuracy Timeline */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Activity" size={20} className="text-primary" />
          <span>Precisión a lo Largo del Tiempo</span>
        </h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={statisticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                domain={[90, 100]}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="var(--color-success)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                name="Precisión %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detection Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-md font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Target" size={18} className="text-primary" />
            <span>Resumen de Detecciones</span>
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total de Detecciones:</span>
              <span className="font-semibold text-foreground">{performanceMetrics?.totalDetections}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Detecciones Válidas:</span>
              <span className="font-semibold text-success">{performanceMetrics?.validDetections}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Detecciones Inválidas:</span>
              <span className="font-semibold text-error">{performanceMetrics?.invalidDetections}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-muted-foreground">Tiempo de Procesamiento:</span>
              <span className="font-semibold text-foreground">{performanceMetrics?.processingTime}s</span>
            </div>
          </div>
        </div>

        {/* Validation Results */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-md font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="CheckCircle" size={18} className="text-primary" />
            <span>Resultados de Validación</span>
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Estado de Validación:</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-success font-medium">Aprobado</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Puntuación de Calidad:</span>
              <span className="font-semibold text-success">A+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Umbral de Confianza:</span>
              <span className="font-semibold text-foreground">&gt; 80%</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-muted-foreground">Fecha de Validación:</span>
              <span className="font-semibold text-foreground">13/11/2025</span>
            </div>
          </div>
        </div>
      </div>
      {/* Export Actions */}
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div>
            <h4 className="font-medium text-foreground">Exportar Resultados</h4>
            <p className="text-sm text-muted-foreground">
              Generar reportes de análisis con métricas de detección y validación
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium flex items-center space-x-2">
              <Icon name="FileText" size={16} />
              <span>Reporte PDF</span>
            </button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors text-sm font-medium flex items-center space-x-2">
              <Icon name="Download" size={16} />
              <span>Datos CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionStatistics;