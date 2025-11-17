import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ValidationBreadcrumb from '../../components/ui/ValidationBreadcrumb';
import VideoPlayer from './components/VideoPlayer';
import PassengerCounter from './components/PassengerCounter';
import DetectionStatistics from './components/DetectionStatistics';
import AudioAlertTester from './components/AudioAlertTester';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import useValidationSessionDetails from '../../hooks/useValidationSessionDetails';

const VideoAnalysisPlayback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [isCapacityExceeded, setIsCapacityExceeded] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');
  const [detectionData, setDetectionData] = useState([]);
  const [videoSrc, setVideoSrc] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const sessionData = location.state?.sessionData;
  const analysisResults = location.state?.analysisResults;
  const uploadedFile = location.state?.videoFile;

  const sessionId =
    location.state?.sessionId ??
    sessionData?.id ??
    analysisResults?.sessionId ??
    null;

  const {
    session: sessionInfo,
    frames: detectionFrames,
    loading: isLoadingData,
    error: sessionError,
  } = useValidationSessionDetails(sessionId);

  const maxCapacity =
    sessionData?.max_capacity_declared ??
    analysisResults?.maxCapacity ??
    sessionInfo?.max_capacity_declared ??
    50;

  useEffect(() => {
    setLoadError(sessionError);
  }, [sessionError]);

  useEffect(() => {
    if (sessionInfo?.processed_video_path) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      setVideoSrc(`${baseUrl}${sessionInfo.processed_video_path}`);
    }
  }, [sessionInfo]);

  useEffect(() => {
    if (detectionFrames && detectionFrames.length > 0) {
      setDetectionData(detectionFrames);
    } else {
      setDetectionData([]);
    }
  }, [detectionFrames]);

  useEffect(() => {
    if (uploadedFile && !videoSrc) {
      const objectUrl = URL.createObjectURL(uploadedFile);
      setVideoSrc(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [uploadedFile, videoSrc]);

  useEffect(() => {
    if (!sessionId && !uploadedFile) {
      setLoadError('No se encontró una sesión de validación asociada.');
    }
  }, [sessionId, uploadedFile]);

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);

    const currentDetection = detectionData?.find((d) => Math.abs(d?.timestamp - time) < 15);

    if (currentDetection) {
      setCurrentCount(currentDetection?.count ?? 0);
      setConfidence(currentDetection?.confidence ?? 0);
      setIsCapacityExceeded((currentDetection?.count ?? 0) > maxCapacity);

      setDetectionHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            timestamp: time,
            count: currentDetection?.count ?? 0,
            confidence: currentDetection?.confidence ?? 0,
          },
        ];
        return newHistory.slice(-20);
      });
    }
  };

  const handleCapacityExceeded = (count, capacity) => {
    console.log(`Capacidad excedida: ${count}/${capacity} pasajeros`);
  };

  const handleAlertTest = (isActive, count, capacity) => {
    console.log(`Alerta ${isActive ? 'activada' : 'desactivada'}: ${count}/${capacity}`);
  };

  const handleExportReport = () => {
    console.log('Exportando reporte de análisis...');
  };

  const handleReturnToLab = () => {
    navigate('/validation-laboratory');
  };

  const tabs = [
    { id: 'analysis', label: 'Análisis de Video', icon: 'Play' },
    { id: 'statistics', label: 'Estadísticas', icon: 'BarChart3' },
    { id: 'alerts', label: 'Alertas de Audio', icon: 'Volume2' },
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
                  videoSrc={videoSrc}
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
              validationResults={analysisResults || {}}
              sessionInfo={sessionInfo}
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
                  Video procesado {sessionInfo ? 'con datos reales' : 'sin datos procesados'}{' '}
                  y {detectionData?.length || 0} puntos de detección analizados
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
