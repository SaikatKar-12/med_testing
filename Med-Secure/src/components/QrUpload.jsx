import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { QrCode, Upload, Search } from 'lucide-react';
import jsQR from 'jsqr';

const QrUpload = ({ onScan }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);

      const qrCodeResult = await detectQrInImage(imageUrl);

      if (qrCodeResult) {
        toast({
          title: "QR Code detected!",
          description: "Processing the link from the QR code...",
        });
        onScan(qrCodeResult);
      } else {
        toast({
          title: "No QR code found",
          description: "We couldn't detect a valid QR code in this image. Please try another image.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error processing QR code image:', error);
      toast({
        title: "Error",
        description: "Failed to process the QR code image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const detectQrInImage = async (imageUrl) => {
    if ('BarcodeDetector' in window) {
      try {
        const img = new Image();
        img.src = imageUrl;
        await new Promise(resolve => { img.onload = resolve; });

        // @ts-ignore (ignored in JS anyway)
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const codes = await detector.detect(img);

        if (codes.length > 0) {
          return codes[0].rawValue;
        }
      } catch (err) {
        console.error('Native QR detection failed:', err);
      }
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = imageUrl;
      });

      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          return code.data;
        }
      }
    } catch (err) {
      console.error('jsQR fallback QR detection failed:', err);
    }

    return null;
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {preview ? (
            <div className="relative w-full h-64 mb-4 border rounded-md overflow-hidden">
              <img
                src={preview}
                alt="QR code preview"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="mb-4 flex flex-col items-center">
              <QrCode className="h-12 w-12 mb-2 text-medical-blue" />
              <h3 className="text-lg font-medium mb-2">Upload QR Code Image</h3>
              <p className="text-sm text-gray-500 text-center">
                You can upload an image containing a QR code from your device
              </p>
            </div>
          )}

          <Button
            onClick={handleUploadClick}
            variant="outline"
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Search className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QrUpload;
