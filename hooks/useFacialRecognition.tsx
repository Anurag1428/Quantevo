'use client';

import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

interface FacialRecognitionResult {
  isMatch: boolean;
  similarity: number;
  confidence: number;
}

export const useFacialRecognition = () => {
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const storedDescriptorRef = useRef<Float32Array | null>(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelsLoaded(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load face recognition models';
        setError(errorMessage);
        console.error('Error loading models:', err);
      }
    };

    loadModels();
  }, []);

  // Start video stream from camera
  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Could not access camera';
      setError(errorMessage);
      console.error('Error accessing camera:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  // Capture face and store descriptor for registration
  const captureFaceDescriptor = async (): Promise<Float32Array | null> => {
    if (!videoRef.current || !isModelsLoaded) {
      setError('Camera not ready or models not loaded');
      return null;
    }

    try {
      setIsLoading(true);
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        setError('No face detected. Please position your face in the camera.');
        return null;
      }

      setError(null);
      const descriptor = detections.descriptor;
      storedDescriptorRef.current = descriptor;
      return descriptor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error capturing face';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify face against stored descriptor
  const verifyFace = async (storedDescriptor: Float32Array): Promise<FacialRecognitionResult> => {
    if (!videoRef.current || !isModelsLoaded) {
      setError('Camera not ready or models not loaded');
      return { isMatch: false, similarity: 0, confidence: 0 };
    }

    try {
      setIsLoading(true);
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        setError('No face detected. Please position your face in the camera.');
        return { isMatch: false, similarity: 0, confidence: 0 };
      }

      const currentDescriptor = detections.descriptor;
      const distance = faceapi.euclideanDistance(storedDescriptor, currentDescriptor);
      
      // Distance threshold: 0.6 is typical for face-api
      const threshold = 0.6;
      const similarity = Math.max(0, 1 - distance / threshold);
      const isMatch = distance < threshold;

      setError(null);
      return {
        isMatch,
        similarity: Math.min(1, similarity),
        confidence: detections.detection.score,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error verifying face';
      setError(errorMessage);
      return { isMatch: false, similarity: 0, confidence: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  // Draw face detection on canvas
  const drawFaceDetection = async () => {
    if (!videoRef.current || !canvasRef.current || !isModelsLoaded) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, detections);
      faceapi.draw.drawFaceLandmarks(canvas, detections);
    } catch (err) {
      console.error('Error drawing face detection:', err);
    }
  };

  return {
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
    storedDescriptor: storedDescriptorRef.current,
  };
};
