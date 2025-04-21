import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Camera, ScanSearch } from 'lucide-react';

const QrScanner = ({ onScan, isScanning, setIsScanning }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isScanning) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isScanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      videoRef.current.play();

      scanQRCode();
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access the camera. Please check your browser settings or try a different device.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const scanQRCode = () => {
    const scanInterval = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) return;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      try {
        if ('BarcodeDetector' in window) {
          // @ts-ignore
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const barcodes = await detector.detect(canvas);

          if (barcodes.length > 0) {
            const rawValue = barcodes[0].rawValue;
            clearInterval(scanInterval);
            stopCamera();
            toast({ title: 'QR Code scanned!', description: 'Processing the result...' });
            onScan(rawValue);
          }
        } else {
          clearInterval(scanInterval);
          stopCamera();
          setError(
            'Your browser does not support camera-based QR scanning. You can still upload a QR code image using the "Upload QR" tab below.'
          );
        }
      } catch (err) {
        console.error('QR scanning error:', err);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <div className="w-full rounded-md overflow-hidden border">
        <video ref={videoRef} className="w-full h-64 object-cover" />
      </div>

      {error && (
        <div className="text-sm text-red-500 text-center">
          {error}
        </div>
      )}

      {!isScanning && (
        <Button onClick={() => setIsScanning(true)} className="w-full">
          <Camera className="mr-2 h-4 w-4" />
          Start Scanning
        </Button>
      )}

      {isScanning && (
        <Button onClick={() => setIsScanning(false)} variant="outline" className="w-full">
          <ScanSearch className="mr-2 h-4 w-4" />
          Stop Scanning
        </Button>
      )}
    </div>
  );
};

export default QrScanner;
