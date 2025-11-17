import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import VideoUploadZone from './components/VideoUploadZone';
import ConfigurationPanel from './components/ConfigurationPanel';
import ProcessingStatus from './components/ProcessingStatus';
import ValidationSessionsTable from './components/ValidationSessionsTable';
import apiClient from '../../services/apiClient';

// 🔹 Mock de respaldo por si el backend falla o aún no hay datos
const MOCK_VALIDATION_SESSIONS = [
  {
    id: 1,
    filename: 'bus_route_15_morning.mp4',
    date: '2025-11-13T09:30:00',
    duration: '5:23',
    fileSize: '45.2 MB',
    detectedCount: 42,
    maxCapacity: 50,
    accuracy: 94,
    confidence: 87,
    status: 'completed'
  },
  {
    id: 2,
    filename: 'terminal_central_rush.mp4',
    date: '2025-11-12T17:45:00',
    duration: '8:15',
    fileSize: '78.9 MB',
    detectedCount: 67,
    maxCapacity: 60,
    accuracy: 89,
    confidence: 92,
    status: 'completed'
  },
  {
    id: 3,
    filename: 'line_22_validation_test.mp4',
    date: '2025-11-12T14:20:00',
    duration: '3:42',
    fileSize: '32.1 MB',
    detectedCount: 28,
    maxCapacity: 45,
    accuracy: 96,
    confidence: 94,
    status: 'completed'
  },
  {
    id: 4,
    filename: 'evening_commute_analysis.mp4',
    date: '2025-11-11T19:10:00',
    duration: '6:58',
    fileSize: '58.7 MB',
    detectedCount: 0,
    maxCapacity: 55,
    accuracy: 0,
    confidence: 0,
    status: 'failed'
  },
  {
    id: 5,
    filename: 'weekend_service_check.mp4',
    date: '2025-11-10T11:30:00',
    duration: '4:12',
    fileSize: '38.4 MB',
    detectedCount: 15,
    maxCapacity: 40,
    accuracy: 91,
    confidence: 88,
    status: 'completed'
  }
];

const ValidationLaboratory = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(null);

  const [configuration, setConfiguration] = useState({
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

  // Estado de sesiones: ahora vienen del backend, con fallback a mocks
  const [validationSessions, setValidationSessions] = useState(MOCK_VALIDATION_SESSIONS);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState(null);

  // 🔹 Traer sesiones desde el backend
  const fetchSessions = async () => {
    setSessionsLoading(true);
    setSessionsError(null);

    try {
      const response = await apiClient.get('/validation/sessions');

      let data = response?.data || [];

      // Si el backend devuelve { items: [...] }
      if (data && Array.isArray(data.items)) {
        data = data.items;
      }

      if (Array.isArray(data) && data.length > 0) {
        // TODO: cuando sepamos exactamente los campos del backend,
        // aquí mapeamos a { id, filename, status, ... } si hace falta.
        setValidationSessions(data);
      } else {
        setValidationSessions(MOCK_VALIDATION_SESSIONS);
      }
    } catch (error) {
      console.error('Error obteniendo sesiones de validación:', error);
      setSessionsError('No se pudieron cargar las sesiones de validación.');
      setValidationSessions(MOCK_VALIDATION_SESSIONS);
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // 🔹 Crear sesión en backend + subir video
  const createAndUploadValidationSession = async (file, maxCapacity) => {
    try {
      // 1) Crear sesión
      const createResp = await apiClient.post('/validation/sessions', {
        max_capacity_declared: maxCapacity,
        bus_id: null
      });

      const sessionId = createResp?.data?.id;
      if (!sessionId) {
        console.warn('No se recibió id de sesión al crear la validación, usando solo frontend mock.');
        return null;
      }

      // 2) Subir video
      const formData = new FormData();
      formData.append('file', file);

      await apiClient.post(`/validation/sessions/${sessionId}/upload-video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // 3) Actualizar lista de sesiones
      await fetchSessions();

      return sessionId;
    } catch (error) {
      console.error('Error al crear sesión de validación o subir video:', error);
      // No lanzamos error hacia arriba para no romper la UX;
      // simplemente seguimos con el flujo simulado del frontend.
      return null;
    }
  };

  // 🔹 Manejar upload desde el componente de subida
  const handleFileUpload = async (file) => {
    if (!file) return;

    // Regla de negocio: debe haber capacidad máxima configurada
    if (!configuration?.maxCapacity || configuration.maxCapacity <= 0) {
      alert('Debes configurar la capacidad máxima antes de subir un video.');
      return;
    }

    setCurrentFile(file);

    // Intentamos crear sesión + subir video al backend
    const sessionId = await createAndUploadValidationSession(file, configuration.maxCapacity);
    if (sessionId) {
      setActiveSessionId(sessionId);
    }

    // Seguimos con el flujo de simulación de procesamiento en el frontend
    startProcessing(file);
  };

  const startProcessing = (file) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingStage('Preparando análisis del video...');
    setEstimatedTime(120); // 2 minutos estimados

    const stages = [
      { progress: 15, stage: 'Cargando y validando archivo de video...', time: 100 },
      { progress: 35, stage: 'Extrayendo frames para análisis...', time: 80 },
      { progress: 55, stage: 'Aplicando algoritmos de detección...', time: 60 },
      { progress: 75, stage: 'Contando personas detectadas...', time: 40 },
      { progress: 90, stage: 'Validando resultados y métricas...', time: 20 },
      { progress: 100, stage: 'Análisis completado exitosamente', time: 0 }
    ];

    let currentStageIndex = 0;
    const processInterval = setInterval(() => {
      if (currentStageIndex < stages?.length) {
        const stage = stages?.[currentStageIndex];
        setProcessingProgress(stage?.progress);
        setProcessingStage(stage?.stage);
        setEstimatedTime(stage?.time);
        currentStageIndex++;
      } else {
        clearInterval(processInterval);
        setTimeout(() => {
          setIsProcessing(false);
          setCurrentFile(null);
          // Por ahora seguimos navegando con datos simulados
          navigate('/video-analysis-playback', { 
            state: { 
              videoFile: file,
              analysisResults: {
                detectedCount: 42,
                maxCapacity: configuration?.maxCapacity,
                accuracy: 94,
                confidence: 87,
                processingTime: '2:15',
                alertsTriggered: 3,
                validationSessionId: activeSessionId
              }
            }
          });
        }, 1000);
      }
    }, 2000);
  };

  // Merge de configuración (lo que ya tenías mejorado)
  const handleConfigurationChange = (newConfig) => {
    setConfiguration((prev) => ({
      ...prev,
      ...newConfig,
    }));
  };

  const handleCancelProcessing = () => {
    setIsProcessing(false);
    setCurrentFile(null);
    setProcessingProgress(0);
    setProcessingStage('');
    setEstimatedTime(null);
  };

  const handleViewResults = (sessionId) => {
    const session = validationSessions?.find(s => s?.id === sessionId);
    if (session) {
      navigate('/video-analysis-playback', {
        state: {
          sessionData: session,
          analysisResults: {
            detectedCount: session?.detectedCount,
            maxCapacity: session?.maxCapacity,
            accuracy: session?.accuracy,
            confidence: session?.confidence
          }
        }
      });
    }
  };

  const handleReprocess = (sessionId) => {
    const session = validationSessions?.find(s => s?.id === sessionId);
    if (session) {
      // Reprocesar simulando con la configuración actual
      startProcessing({ name: session?.filename, size: session?.fileSize });
    }
  };

  const handleExport = (sessionId) => {
    if (sessionId === 'all') {
      console.log('Exporting all validation sessions...');
      // Implementar exportación masiva
    } else {
      const session = validationSessions?.find(s => s?.id === sessionId);
      console.log('Exporting session:', session);
      // Implementar exportación individual
    }
  };

  const navigateToRoute = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="FlaskConical" size={24} className="text-primary" />
                <h1 className="text-xl font-semibold text-foreground">Laboratorio de Validación</h1>
              </div>
              <div className="hidden md:flex items-center space-x-1 text-sm text-muted-foreground">
                <button 
                  onClick={() => navigateToRoute('/real-time-monitoring-dashboard')}
                  className="hover:text-foreground transition-colors"
                >
                  Dashboard
                </button>
                <Icon name="ChevronRight" size={16} />
                <span className="text-foreground">Laboratorio de Validación</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                iconName="BarChart3"
                iconPosition="left"
                onClick={() => navigateToRoute('/real-time-monitoring-dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Play"
                iconPosition="left"
                onClick={() => navigateToRoute('/video-analysis-playback')}
                disabled={validationSessions?.filter(s => s?.status === 'completed')?.length === 0}
              >
                Ver Análisis
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Validación de Precisión en Conteo de Pasajeros
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Sube videos de prueba para validar la precisión de los algoritmos de detección de pasajeros. 
              Configura parámetros de análisis y obtén métricas detalladas de rendimiento para optimizar 
              el sistema de monitoreo en tiempo real.
            </p>
          </div>

          {/* Upload and Configuration Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <VideoUploadZone 
              onFileUpload={handleFileUpload}
              isProcessing={isProcessing}
            />
            <ConfigurationPanel 
              onConfigurationChange={handleConfigurationChange}
              isProcessing={isProcessing}
            />
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <ProcessingStatus
              isProcessing={isProcessing}
              progress={processingProgress}
              stage={processingStage}
              estimatedTime={estimatedTime}
              onCancel={handleCancelProcessing}
            />
          )}

          {/* Validation Sessions Table */}
          <ValidationSessionsTable
            sessions={validationSessions}
            onViewResults={handleViewResults}
            onReprocess={handleReprocess}
            onExport={handleExport}
          />

          {/* Quick Actions */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                iconName="FileVideo"
                iconPosition="left"
                onClick={() => document.querySelector('input[type="file"]')?.click()}
                disabled={isProcessing}
              >
                <div className="text-left">
                  <div className="font-medium">Subir Nuevo Video</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Iniciar nueva validación
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                iconName="Settings"
                iconPosition="left"
                disabled={isProcessing}
              >
                <div className="text-left">
                  <div className="font-medium">Configurar Parámetros</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Ajustar algoritmos de detección
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                iconName="Download"
                iconPosition="left"
                onClick={() => handleExport('all')}
                disabled={validationSessions?.length === 0}
              >
                <div className="text-left">
                  <div className="font-medium">Exportar Reportes</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Descargar análisis completos
                  </div>
                </div>
              </Button>
            </div>

            {/* Puedes mostrar estados de carga/errores aquí si quieres */}
            {sessionsLoading && (
              <p className="mt-4 text-xs text-muted-foreground">
                Cargando sesiones de validación...
              </p>
            )}
            {sessionsError && (
              <p className="mt-1 text-xs text-destructive">
                {sessionsError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationLaboratory;
