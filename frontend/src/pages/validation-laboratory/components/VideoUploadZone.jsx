import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoUploadZone = ({ onFileUpload, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const supportedFormats = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];
  const maxFileSize = 500; // MB

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    handleFileSelection(files);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e?.target?.files);
    handleFileSelection(files);
  };

  const handleFileSelection = (files) => {
    const videoFile = files?.find(file => file?.type?.startsWith('video/'));
    
    if (!videoFile) {
      alert('Por favor, selecciona un archivo de video válido.');
      return;
    }

    if (videoFile?.size > maxFileSize * 1024 * 1024) {
      alert(`El archivo es demasiado grande. Tamaño máximo: ${maxFileSize}MB`);
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          onFileUpload(videoFile);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Subir Video de Prueba</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Video" size={16} />
          <span>Formatos soportados</span>
        </div>
      </div>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : isProcessing
            ? 'border-muted bg-muted/20' :'border-border hover:border-primary/50 hover:bg-muted/30'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadProgress > 0 && uploadProgress < 100 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full">
              <Icon name="Upload" size={24} className="text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Subiendo video...</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{uploadProgress}% completado</p>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-warning/10 rounded-full">
              <Icon name="Loader2" size={24} className="text-warning animate-spin" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Procesando video...</p>
              <p className="text-xs text-muted-foreground">Analizando contenido para detección de pasajeros</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-muted rounded-full">
              <Icon name="VideoIcon" size={24} className="text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Arrastra y suelta tu video aquí
              </p>
              <p className="text-xs text-muted-foreground">
                o haz clic para seleccionar un archivo
              </p>
            </div>
            <Button
              variant="outline"
              onClick={openFileDialog}
              iconName="FolderOpen"
              iconPosition="left"
              disabled={isProcessing}
            >
              Seleccionar Archivo
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isProcessing}
        />
      </div>
      {/* File Requirements */}
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Requisitos del archivo:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="FileVideo" size={14} />
            <span>Formatos: {supportedFormats?.join(', ')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="HardDrive" size={14} />
            <span>Tamaño máximo: {maxFileSize}MB</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} />
            <span>Duración recomendada: 1-10 minutos</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Monitor" size={14} />
            <span>Resolución mínima: 720p</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadZone;