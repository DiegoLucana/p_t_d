import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoPlayer = ({
  videoSrc,
  detectionData,
  onTimeUpdate,
  onCapacityExceeded,
  maxCapacity = 50
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    video.pause();
    video.load?.();
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video?.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
      
      // Check capacity and trigger alert
      const currentDetection = getCurrentDetection(time);
      if (currentDetection && currentDetection?.count > maxCapacity) {
        onCapacityExceeded?.(currentDetection?.count, maxCapacity);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video?.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video?.addEventListener('timeupdate', handleTimeUpdate);
    video?.addEventListener('loadedmetadata', handleLoadedMetadata);
    video?.addEventListener('play', handlePlay);
    video?.addEventListener('pause', handlePause);

    return () => {
      video?.removeEventListener('timeupdate', handleTimeUpdate);
      video?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video?.removeEventListener('play', handlePlay);
      video?.removeEventListener('pause', handlePause);
    };
  }, [maxCapacity, onTimeUpdate, onCapacityExceeded]);

  useEffect(() => {
    if (showOverlay) {
      drawDetectionOverlay();
    }
  }, [currentTime, showOverlay, detectionData]);

  useEffect(() => {
    if (!videoSrc && onVideoError) {
      onVideoError('No se pudo cargar el video procesado.');
    }
  }, [videoSrc, onVideoError]);


  const getCurrentDetection = (time) => {
    return detectionData?.find(detection => 
      Math.abs(detection?.timestamp - time) < 0.5
    );
  };

  const drawDetectionOverlay = () => {
    const canvas = canvasRef?.current;
    const video = videoRef?.current;
    if (!canvas || !video) return;

    const ctx = canvas?.getContext('2d');
    canvas.width = video?.videoWidth;
    canvas.height = video?.videoHeight;
    
    ctx?.clearRect(0, 0, canvas?.width, canvas?.height);

    const currentDetection = getCurrentDetection(currentTime);
    if (!currentDetection) return;

    // Draw bounding boxes
    currentDetection?.detections?.forEach((detection, index) => {
      const { x, y, width, height, confidence } = detection;
      
      // Box color based on confidence
      const color = confidence > 0.8 ? '#10B981' : confidence > 0.6 ? '#F59E0B' : '#EF4444';
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx?.strokeRect(x, y, width, height);
      
      // Confidence label
      ctx.fillStyle = color;
      ctx?.fillRect(x, y - 25, 60, 20);
      ctx.fillStyle = 'white';
      ctx.font = '12px Inter';
      ctx?.fillText(`${Math.round(confidence * 100)}%`, x + 5, y - 10);
      
      // Person ID
      ctx.fillStyle = color;
      ctx?.fillRect(x, y + height, 30, 20);
      ctx.fillStyle = 'white';
      ctx?.fillText(`P${index + 1}`, x + 5, y + height + 15);
    });
  };

  const togglePlayPause = () => {
    const video = videoRef?.current;
    if (isPlaying) {
      video?.pause();
    } else {
      video?.play();
    }
  };

  const handleSeek = (e) => {
    const video = videoRef?.current;
    const rect = e?.currentTarget?.getBoundingClientRect();
    const pos = (e?.clientX - rect?.left) / rect?.width;
    video.currentTime = pos * duration;
  };

  const stepFrame = (direction) => {
    const video = videoRef?.current;
    video.currentTime += direction * (1 / 30); // Assuming 30fps
  };

  const changePlaybackRate = (rate) => {
    const video = videoRef?.current;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const handleVideoError = () => {
    setIsPlaying(false);
    setDuration(0);
    onTimeUpdate?.(0);
    onVideoError?.(
      'No se pudo cargar el video procesado. Verifica que el archivo exista en el servidor.'
    );
  };


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds?.toString()?.padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    const container = videoRef?.current?.parentElement;
    if (!isFullscreen) {
      container?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden shadow-elevated">
      {/* Video Container */}
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-contain"
          preload="metadata"
          key={videoSrc || 'video-player'}
          onError={handleVideoError}

        />
        
        {/* Detection Overlay Canvas */}
        {showOverlay && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ mixBlendMode: 'multiply' }}
          />
        )}

        {/* Loading Overlay */}
        {(!duration || !videoSrc) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="flex items-center space-x-3 text-white">
              <div className="animate-spin">
                <Icon name="Loader2" size={24} />
              </div>
              <span>Cargando video...</span>
              <span>{videoSrc ? 'Cargando video...' : 'Video procesado no disponible'}</span>

            </div>
          </div>
        )}
      </div>
      {/* Controls */}
      <div className="bg-gray-900 text-white p-4 space-y-3">
        {/* Timeline */}
        <div className="space-y-2">
          <div 
            className="relative h-2 bg-gray-700 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="absolute h-full bg-primary rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <div 
              className="absolute w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1"
              style={{ left: `${(currentTime / duration) * 100}%`, marginLeft: '-8px' }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-300">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Frame Step Back */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => stepFrame(-1)}
              iconName="SkipBack"
              iconSize={16}
              className="text-white hover:bg-gray-700"
            />

            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayPause}
              iconName={isPlaying ? "Pause" : "Play"}
              iconSize={20}
              className="text-white hover:bg-gray-700"
            />

            {/* Frame Step Forward */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => stepFrame(1)}
              iconName="SkipForward"
              iconSize={16}
              className="text-white hover:bg-gray-700"
            />

            {/* Playback Speed */}
            <div className="flex items-center space-x-1 ml-4">
              <span className="text-sm text-gray-300">Velocidad:</span>
              <select
                value={playbackRate}
                onChange={(e) => changePlaybackRate(parseFloat(e?.target?.value))}
                className="bg-gray-700 text-white text-sm rounded px-2 py-1 border-none outline-none"
              >
                <option value={0.25}>0.25x</option>
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Overlay Toggle */}
            <Button
              variant={showOverlay ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowOverlay(!showOverlay)}
              iconName="Eye"
              iconSize={16}
              className={showOverlay ? "" : "text-white hover:bg-gray-700"}
            >
              Detecciones
            </Button>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <Icon name="Volume2" size={16} className="text-gray-300" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => {
                  const vol = parseFloat(e?.target?.value);
                  setVolume(vol);
                  videoRef.current.volume = vol;
                }}
                className="w-20"
              />
            </div>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              iconName={isFullscreen ? "Minimize" : "Maximize"}
              iconSize={16}
              className="text-white hover:bg-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;