import { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw, Check, CircleAlert as AlertCircle, Loader as Loader2 } from 'lucide-react';

export default function CameraCapture({ onCapture, disabled }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [status, setStatus] = useState('idle');
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [error, setError] = useState('');

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setStatus('starting');
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus('live');
    } catch (err) {
      let msg = 'Could not access the camera.';
      if (err.name === 'NotAllowedError') msg = 'Camera permission was denied. Please allow camera access in your browser settings and try again.';
      else if (err.name === 'NotFoundError') msg = 'No camera was found on this device.';
      else if (err.name === 'NotReadableError') msg = 'The camera is already in use by another application. Close it and try again.';
      setError(msg);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopStream();
  }, [startCamera, stopStream]);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      setCapturedBlob(blob);
      setStatus('captured');
      stopStream();
    }, 'image/jpeg', 0.85);
  };

  const retake = () => {
    setCapturedBlob(null);
    setStatus('idle');
    setError('');
    onCapture(null);
    startCamera();
  };

  const confirm = () => {
    if (capturedBlob) onCapture(capturedBlob);
  };

  if (status === 'error') {
    return (
      <div className="camera-error">
        <AlertCircle size={32} />
        <p>{error}</p>
        <button className="btn btn-outline" onClick={startCamera} disabled={disabled}>
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="camera-capture">
      {status === 'starting' && (
        <div className="camera-loading">
          <Loader2 size={28} className="spin" />
          <p>Starting camera…</p>
        </div>
      )}

      {status !== 'captured' && (
        <div className="camera-viewfinder">
          <video ref={videoRef} autoPlay playsInline muted className={status === 'live' ? 'visible' : 'hidden'} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {status === 'live' && (
            <div className="camera-controls">
              <button className="capture-btn" onClick={capture} disabled={disabled} aria-label="Take photo" />
            </div>
          )}
        </div>
      )}

      {status === 'captured' && capturedBlob && (
        <div className="camera-preview">
          <img src={URL.createObjectURL(capturedBlob)} alt="Captured" className="captured-image" />
          <div className="camera-controls">
            <button className="btn btn-outline" onClick={retake} disabled={disabled}>
              <RefreshCw size={16} /> Retake
            </button>
            <button className="btn btn-primary" onClick={confirm} disabled={disabled}>
              <Check size={16} /> Use Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
