import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const formatTimeLabel = (seconds) => {
  const safeSeconds = Number.isFinite(seconds) ? seconds : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const secs = Math.floor(safeSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatMetric = (value, suffix = '') => {
  if (value === null || typeof value === 'undefined') return '—';
  return `${value}${suffix}`;
};

const getMetricColor = (value, thresholds) => {
  if (value === null || typeof value === 'undefined') return 'text-muted-foreground';
  if (value >= thresholds?.good) return 'text-success';
  if (value >= thresholds?.warning) return 'text-warning';
  return 'text-error';
};

const getMetricBgColor = (value, thresholds) => {
  if (value === null || typeof value === 'undefined') return 'bg-muted/40';
  if (value >= thresholds?.good) return 'bg-success/10';
  if (value >= thresholds?.warning) return 'bg-warning/10';
  return 'bg-error/10';
};

const DetectionStatistics = ({
  detectionData = [],
  accuracyMetrics = {},
  validationResults = {},
  sessionInfo,
}) => {
  const statisticsData = useMemo(
    () =>
      detectionData.map((item, index) => ({
        time: formatTimeLabel(item?.timestamp ?? index),
        detected: item?.count ?? 0,
        manual: validationResults?.manualCounts?.[index] ?? null,
        accuracy:
          validationResults?.accuracyTimeline?.[index] ??
          validationResults?.overallAccuracy ??
          accuracyMetrics?.overall ?? null,
      })),
    [accuracyMetrics?.overall, detectionData, validationResults?.accuracyTimeline, validationResults?.manualCounts, validationResults?.overallAccuracy],
  );

  const totalDetections = detectionData.reduce((sum, item) => sum + (item?.count ?? 0), 0);
  const peakOccupancy = detectionData.reduce((max, item) => Math.max(max, item?.count ?? 0), 0);
  const avgConfidence = detectionData.length
    ? (detectionData.reduce((sum, item) => sum + (item?.confidence ?? 0), 0) / detectionData.length) * 100
    : null;

  const processingTimeSeconds =
    sessionInfo?.processing_started_at && sessionInfo?.processing_finished_at
      ? Math.round(
          (new Date(sessionInfo.processing_finished_at).getTime() -
            new Date(sessionInfo.processing_started_at).getTime()) /
            1000,
        )
      : null;

  const performanceMetrics = {
    overallAccuracy: validationResults?.overallAccuracy ?? accuracyMetrics?.overall ?? null,
    falsePositiveRate: validationResults?.falsePositiveRate ?? null,
    falseNegativeRate: validationResults?.falseNegativeRate ?? null,
    averageConfidence: validationResults?.averageConfidence ?? (avgConfidence !== null ? Number(avgConfidence.toFixed(1)) : null),
    processingTime: validationResults?.processingTime ?? (processingTimeSeconds !== null ? `${processingTimeSeconds}s` : null),
    totalDetections,
    validDetections: validationResults?.validDetections ?? null,
    invalidDetections: validationResults?.invalidDetections ?? null,
    peakOccupancy,
  };

  const validationStatus = validationResults?.status || sessionInfo?.status;
  const statusLabel = validationStatus ? validationStatus.toString().toUpperCase() : 'PENDIENTE';

  const hasTimelineData = statisticsData.length > 0;

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
              {formatMetric(performanceMetrics?.overallAccuracy, performanceMetrics?.overallAccuracy !== null ? '%' : '')}
            </div>
            <div className="text-sm text-muted-foreground">Precisión General</div>
          </div>

          {/* False Positive Rate */}
          <div className={`${getMetricBgColor(performanceMetrics?.falsePositiveRate, { good: 5, warning: 10 })} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${getMetricColor(performanceMetrics?.falsePositiveRate, { good: 5, warning: 10 })}`}>
              {formatMetric(performanceMetrics?.falsePositiveRate, performanceMetrics?.falsePositiveRate !== null ? '%' : '')}
            </div>
            <div className="text-sm text-muted-foreground">Falsos Positivos</div>
          </div>

          {/* False Negative Rate */}
          <div className={`${getMetricBgColor(performanceMetrics?.falseNegativeRate, { good: 5, warning: 10 })} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${getMetricColor(performanceMetrics?.falseNegativeRate, { good: 5, warning: 10 })}`}>
              {formatMetric(performanceMetrics?.falseNegativeRate, performanceMetrics?.falseNegativeRate !== null ? '%' : '')}
            </div>
            <div className="text-sm text-muted-foreground">Falsos Negativos</div>
          </div>

          {/* Average Confidence */}
          <div className={`${getMetricBgColor(performanceMetrics?.averageConfidence, { good: 85, warning: 70 })} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${getMetricColor(performanceMetrics?.averageConfidence, { good: 85, warning: 70 })}`}>
              {formatMetric(performanceMetrics?.averageConfidence, performanceMetrics?.averageConfidence !== null ? '%' : '')}
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
          {hasTimelineData ? (
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
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-md">
              Aún no hay detecciones suficientes para graficar.
            </div>
          )}
        </div>
      </div>
      {/* Accuracy Timeline */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Activity" size={20} className="text-primary" />
          <span>Precisión a lo Largo del Tiempo</span>
        </h3>

        <div className="h-64">
          {hasTimelineData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statisticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="time"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis
                  domain={[0, 100]}
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
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-md">
              Sin registros de precisión para mostrar.
            </div>
          )}
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
              <span className="font-semibold text-foreground">{formatMetric(performanceMetrics?.totalDetections)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Pico de Ocupación:</span>
              <span className="font-semibold text-foreground">{formatMetric(performanceMetrics?.peakOccupancy)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Detecciones Válidas:</span>
              <span className="font-semibold text-success">{formatMetric(performanceMetrics?.validDetections)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Detecciones Inválidas:</span>
              <span className="font-semibold text-error">{formatMetric(performanceMetrics?.invalidDetections)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-muted-foreground">Tiempo de Procesamiento:</span>
              <span className="font-semibold text-foreground">{formatMetric(performanceMetrics?.processingTime)}</span>
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
                <span className="text-success font-medium">{statusLabel}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Puntuación de Calidad:</span>
              <span className="font-semibold text-success">{formatMetric(performanceMetrics?.overallAccuracy, performanceMetrics?.overallAccuracy !== null ? '%' : '')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Umbral de Confianza:</span>
              <span className="font-semibold text-foreground">{formatMetric(performanceMetrics?.averageConfidence, performanceMetrics?.averageConfidence !== null ? '%' : '')}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-muted-foreground">Fecha de Validación:</span>
              <span className="font-semibold text-foreground">
                {sessionInfo?.created_at
                  ? new Date(sessionInfo.created_at).toLocaleDateString('es-ES')
                  : '—'}
              </span>
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
