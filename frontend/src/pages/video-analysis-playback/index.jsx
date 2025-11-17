import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ValidationBreadcrumb from '../../components/ui/ValidationBreadcrumb';
import VideoPlayer from './components/VideoPlayer';
import PassengerCounter from './components/PassengerCounter';
import DetectionStatistics from './components/DetectionStatistics';
import AudioAlertTester from './components/AudioAlertTester';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import apiClient from '../../services/apiClient';

const VideoAnalysisPlayback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [isCapacityExceeded, setIsCapacityExceeded] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');

  // 🔹 NUEVO: estado para datos reales del backend
  const [sessionInfo, setSessionInfo] = useState(location.state?.sessionData || null);
  const [backendDetections, setBackendDetections] = useState([]);
  const [videoSrc, setVideoSrc] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Datos que vienen desde el Laboratorio de Validación
  const sessionData = location.state?.sessionData;
  const analysisResults = location.state?.analysisResults;

  // Posibles fuentes de sessionId
  const sessionId =
    location.state?.sessionId ??
    sessionData?.id ??
    analysisResults?.sessionId ??
    null;

  // Capacidad máxima real usada para el contador y el beep
  const maxCapacity =
    sessionData?.maxCapacity ??
    analysisResults?.maxCapacity ??
    sessionInfo?.max_capacity_declared ??
    50;

  // 🔹 Mocks originales como fallback
  const mockVideoSrc =
    'frontend\public\videos\video_procesado.mp4';

  const mockDetectionData = useMemo(
    () => [
      {
        timestamp: 0,
        count: 12,
        confidence: 0.92,
        detections: [
          { x: 100, y: 150, width: 80, height: 120, confidence: 0.95 },
          { x: 200, y: 180, width: 75, height: 115, confidence: 0.89 },
          { x: 320, y: 160, width: 85, height: 125, confidence: 0.94 },
          { x: 450, y: 140, width: 78, height: 118, confidence: 0.91 },
          { x: 580, y: 170, width: 82, height: 122, confidence: 0.88 },
          { x: 120, y: 280, width: 76, height: 116, confidence: 0.93 },
          { x: 250, y: 300, width: 84, height: 124, confidence: 0.90 },
          { x: 380, y: 290, width: 79, height: 119, confidence: 0.87 },
          { x: 510, y: 310, width: 81, height: 121, confidence: 0.92 },
          { x: 640, y: 285, width: 77, height: 117, confidence: 0.89 },
          { x: 180, y: 420, width: 83, height: 123, confidence: 0.91 },
          { x: 310, y: 440, width: 80, height: 120, confidence: 0.88 }
        ]
      },
      {
        timestamp: 30,
        count: 18,
        confidence: 0.89,
        detections: Array.from({ length: 18 }, (_, i) => ({
          x: 50 + (i % 6) * 120,
          y: 120 + Math.floor(i / 6) * 140,
          width: 75 + Math.random() * 15,
          height: 115 + Math.random() * 15,
          confidence: 0.85 + Math.random() * 0.15
        }))
      },
      {
        timestamp: 60,
        count: 25,
        confidence: 0.91,
        detections: Array.from({ length: 25 }, (_, i) => ({
          x: 40 + (i % 7) * 100,
          y: 100 + Math.floor(i / 7) * 120,
          width: 70 + Math.random() * 20,
          height: 110 + Math.random() * 20,
          confidence: 0.80 + Math.random() * 0.20
        }))
      },
      {
        timestamp: 90,
        count: 32,
        confidence: 0.87,
        detections: Array.from({ length: 32 }, (_, i) => ({
          x: 30 + (i % 8) * 90,
          y: 80 + Math.floor(i / 8) * 110,
          width: 65 + Math.random() * 25,
          height: 105 + Math.random() * 25,
          confidence: 0.75 + Math.random() * 0.25
        }))
      },
      {
        timestamp: 120,
        count: 28,
        confidence: 0.93,
        detections: Array.from({ length: 28 }, (_, i) => ({
          x: 45 + (i % 7) * 105,
          y: 90 + Math.floor(i / 7) * 125,
          width: 72 + Math.random() * 18,
          height: 112 + Math.random() * 18,
          confidence: 0.82 + Math.random() * 0.18
        }))
      },
      {
        timestamp: 150,
        count: 35,
        confidence: 0.85,
        detections: Array.from({ length: 35 }, (_, i) => ({
          x: 25 + (i % 9) * 85,
          y: 70 + Math.floor(i / 9) * 105,
          width: 68 + Math.random() * 22,
          height: 108 + Math.random() * 22,
          confidence: 0.78 + Math.random() * 0.22
        }))
      },
      {
        timestamp: 180,
        count: 42,
        confidence: 0.88,
        detections: Array.from({ length: 42 }, (_, i) => ({
          x: 20 + (i % 10) * 78,
          y: 60 + Math.floor(i / 10) * 100,
          width: 65 + Math.random() * 20,
          height: 105 + Math.random() * 20,
          confidence: 0.80 + Math.random() * 0.20
        }))
      },
      {
        timestamp: 210,
        count: 55,
        confidence: 0.82,
        detections: Array.from({ length: 55 }, (_, i) => ({
          x: 15 + (i % 12) * 65,
          y: 50 + Math.floor(i / 12) * 95,
          width: 62 + Math.random() * 18,
          height: 102 + Math.random() * 18,
          confidence: 0.75 + Math.random() * 0.25
        }))
      }
    ],
    []
  );

  // 🔹 Detecciones que realmente usará la UI (backend si hay, mocks si no)
  const detectionData = backendDetections.length > 0 ? backendDetections : mockDetectionData;

  // 🔹 Video final a reproducir (backend si trae ruta, sino mock)
  const effectiveVideoSrc = videoSrc || mockVideoSrc;

  // 🔹 Cargar datos reales del backend (si tenemos sessionId)
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        return;
      }

      try {
        setIsLoadingData(true);
        setLoadError(null);

        const [sessionRes, framesRes] = await Promise.all([
          apiClient.get(`/validation/sessions/${sessionId}`),
          apiClient.get(`/validation/sessions/${sessionId}/frame-stats`)
        ]);

        const session = sessionRes.data;
        setSessionInfo(session);

        // Construir URL de video procesado si viene del backend
        if (session?.processed_video_path) {
          const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
          setVideoSrc(`${baseUrl}${session.processed_video_path}`);
        }

        const frames = framesRes.data || [];

        if (frames.length > 0) {
          const transformed = frames.map((f, idx) => ({
            timestamp: f.timestamp_relative ?? idx,
            count: f.detected_passengers ?? 0,
            confidence: f.confidence ?? 0.9,
            // De momento sin bounding boxes reales; se integrarán cuando el pipeline de YOLO devuelva esa info
            detections: []
          }));
          setBackendDetections(transformed);
        }
      } catch (error) {
        console.error('Error cargando datos de validación', error);
        setLoadError('No se pudo cargar el análisis desde el backend. Se mostrarán datos de ejemplo.');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);

    // Buscar detección más cercana a este instante
    const currentDetection = detectionData?.find((d) => Math.abs(d?.timestamp - time) < 15);

    if (currentDetection) {
      setCurrentCount(currentDetection?.count);
      setConfidence(currentDetection?.confidence);
      setIsCapacityExceeded(currentDetection?.count > maxCapacity);

      // Historial compacto
      setDetectionHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            timestamp: time,
            count: currentDetection?.count,
            confidence: currentDetection?.confidence
          }
        ];
        return newHistory.slice(-20);
      });
    }
  };

  const handleCapacityExceeded = (count, capacity) => {
    // Aquí podrías registrar logs, enviar a backend, etc.
    console.log(`Capacidad excedida: ${count}/${capacity} pasajeros`);
  };

  const handleAlertTest = (isActive, count, capacity) => {
    console.log(`Alerta ${isActive ? 'activada' : 'desactivada'}: ${count}/${capacity}`);
  };

  const handleExportReport = () => {
    console.log('Exportando reporte de análisis...');
    // En el futuro: llamada a backend para generar PDF/CSV
  };

  const handleReturnToLab = () => {
    navigate('/validation-laboratory');
  };

  const tabs = [
    { id: 'analysis', label: 'Análisis de Video', icon: 'Play' },
    { id: 'statistics', label: 'Estadísticas', icon: 'BarChart3' },
    { id: 'alerts', label: 'Alertas de Audio', icon: 'Volume2' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <ValidationBreadcrumb />
          </div>

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Análisis de Video con Detección
              </h1>
              <p className="text-muted-foreground">
                Revisión detallada de video procesado con visualización de detección de pasajeros
                sincronizada
              </p>
              {sessionInfo && (
                <p className="text-xs text-muted-foreground mt-2">
                  Sesión #{sessionInfo.id} · Capacidad declarada:{' '}
                  <span className="font-semibold">{maxCapacity}</span> · Máx. detectado:{' '}
                  <span className="font-semibold">
                    {sessionInfo.detected_max_occupancy ?? '—'}
                  </span>
                </p>
              )}
              {loadError && (
                <p className="text-xs text-error mt-1">
                  {loadError}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button
                variant="outline"
                onClick={handleReturnToLab}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Volver al Laboratorio
              </Button>
              <Button
                variant="default"
                onClick={handleExportReport}
                iconName="Download"
                iconPosition="left"
              >
                Exportar Reporte
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Pequeño aviso de carga de datos del backend */}
          {isLoadingData && (
            <div className="mb-4 text-sm text-muted-foreground flex items-center space-x-2">
              <div className="animate-spin">
                <Icon name="Loader2" size={16} />
              </div>
              <span>Cargando datos de análisis desde el servidor...</span>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'analysis' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Video Player - Takes up 2 columns on xl screens */}
              <div className="xl:col-span-2">
                <VideoPlayer
                  videoSrc={effectiveVideoSrc}
                  detectionData={detectionData}
                  onTimeUpdate={handleTimeUpdate}
                  onCapacityExceeded={handleCapacityExceeded}
                  maxCapacity={maxCapacity}
                />
              </div>

              {/* Passenger Counter - Takes up 1 column on xl screens */}
              <div>
                <PassengerCounter
                  currentCount={currentCount}
                  maxCapacity={maxCapacity}
                  confidence={confidence}
                  timestamp={currentTime}
                  detectionHistory={detectionHistory}
                />
              </div>
            </div>
          )}

          {activeTab === 'statistics' && (
            <DetectionStatistics
              detectionData={detectionData}
              accuracyMetrics={{}}
              validationResults={{}}
            />
          )}

          {activeTab === 'alerts' && (
            <div className="max-w-4xl mx-auto">
              <AudioAlertTester
                isCapacityExceeded={isCapacityExceeded}
                currentCount={currentCount}
                maxCapacity={maxCapacity}
                onAlertTest={handleAlertTest}
              />
            </div>
          )}

          {/* Quick Actions Footer */}
          <div className="mt-12 bg-muted/30 border border-border rounded-lg p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Análisis Completado</h3>
                <p className="text-sm text-muted-foreground">
                  Video procesado {backendDetections.length > 0 ? 'con datos reales' : 'con datos de ejemplo'}{' '}
                  y {detectionData?.length} puntos de detección analizados
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Button
                  variant="outline"
                  iconName="RotateCcw"
                  iconPosition="left"
                  onClick={() => window.location?.reload()}
                >
                  Reiniciar Análisis
                </Button>
                <Button
                  variant="default"
                  iconName="Upload"
                  iconPosition="left"
                  onClick={handleReturnToLab}
                >
                  Analizar Nuevo Video
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoAnalysisPlayback;
