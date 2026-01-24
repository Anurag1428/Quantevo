'use client';

import { useEffect, useState } from 'react';
import { useFacialRecognition } from '@/hooks/useFacialRecognition';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface FacialLoginProps {
  onSuccess: (faceData: string) => void;
  onError: (error: string) => void;
  mode?: 'register' | 'login';
}

export const FacialLogin = ({ onSuccess, onError, mode = 'login' }: FacialLoginProps) => {
  const [step, setStep] = useState<'idle' | 'capturing' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const {
    videoRef,
    canvasRef,
    isModelsLoaded,
    isLoading,
    error,
    startCamera,
    stopCamera,
    captureFaceDescriptor,
    verifyFace,
    drawFaceDetection,
  } = useFacialRecognition();

  useEffect(() => {
    if (error) {
      setStep('error');
      setMessage(error);
      onError(error);
    }
  }, [error, onError]);

  // Animation loop for face detection
  useEffect(() => {
    if (step !== 'capturing') return;

    const animationId = setInterval(() => {
      drawFaceDetection();
    }, 100);

    return () => clearInterval(animationId);
  }, [step, drawFaceDetection]);

  const handleStartCapture = async () => {
    setStep('capturing');
    setMessage(mode === 'register' ? 'Position your face in the camera...' : 'Position your face to begin login...');
    await startCamera();
  };

  const handleCaptureFace = async () => {
    setStep('verifying');
    setMessage(mode === 'register' ? 'Capturing your face...' : 'Verifying your face...');

    const descriptor = await captureFaceDescriptor();

    if (descriptor) {
      // Convert Float32Array to base64 for storage
      const buffer = Buffer.from(descriptor.buffer);
      const base64 = buffer.toString('base64');

      setStep('success');
      setMessage(mode === 'register' ? 'Face registered successfully!' : 'Face verified! Logging in...');

      setTimeout(() => {
        stopCamera();
        onSuccess(base64);
      }, 1500);
    } else {
      setStep('error');
      setMessage('Failed to capture face. Please try again.');
    }
  };

  const handleRetry = () => {
    setStep('idle');
    setMessage('');
    stopCamera();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg border border-gray-200">
      <div className="space-y-4">
        {/* Models Loading Status */}
        {!isModelsLoaded && (
          <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <p className="text-sm text-blue-700">Loading face recognition models...</p>
          </div>
        )}

        {/* Camera Feed */}
        {step !== 'idle' && (
          <div className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />

            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
        )}

        {/* Status Message */}
        <div className="flex items-center gap-2">
          {step === 'capturing' && (
            <>
              <Camera className="w-5 h-5 text-blue-600 animate-pulse" />
              <p className="text-sm text-gray-700">{message}</p>
            </>
          )}
          {step === 'verifying' && (
            <>
              <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
              <p className="text-sm text-gray-700">{message}</p>
            </>
          )}
          {step === 'success' && (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-700">{message}</p>
            </>
          )}
          {step === 'error' && (
            <>
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-700">{message}</p>
            </>
          )}
          {step === 'idle' && (
            <>
              <Camera className="w-5 h-5 text-gray-400" />
              <p className="text-sm text-gray-500">
                {mode === 'register' 
                  ? 'Register your face for future logins'
                  : 'Use facial recognition to login'
                }
              </p>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {step === 'idle' && isModelsLoaded && (
            <Button
              onClick={handleStartCapture}
              disabled={isLoading}
              className="yellow-btn w-full"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start {mode === 'register' ? 'Registration' : 'Facial Login'}
            </Button>
          )}

          {step === 'capturing' && (
            <>
              <Button
                onClick={handleCaptureFace}
                disabled={isLoading}
                className="yellow-btn flex-1"
              >
                {isLoading ? 'Processing...' : 'Capture & Verify'}
              </Button>
              <Button
                onClick={handleRetry}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </>
          )}

          {step === 'error' && (
            <Button
              onClick={handleRetry}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          )}
        </div>

        {/* Info Box */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            💡 Tips: Ensure good lighting, clear face visibility, and no obstructions like hats or sunglasses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacialLogin;
