import React, { useEffect, useRef, useState } from "react";

const QRScanner = () => {
  const [decodedText, setDecodedText] = useState("Waiting for scan...");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const scannerInstance = useRef(null);

  const loadScript = () => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/html5-qrcode";
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => setDecodedText("Failed to load QR script.");
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadScript();
  }, []);

  useEffect(() => {
    if (!isScriptLoaded || !window.Html5Qrcode) return;

    const html5QrCode = new window.Html5Qrcode("reader");

    window.Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices.length) {
          const cameraId = devices[0].id;
          html5QrCode
            .start(
              cameraId,
              { fps: 10, qrbox: 250 },
              (decodedText) => setDecodedText(decodedText),
              (error) => {} // silent error
            )
            .catch((err) => {
              setDecodedText("Camera start error: " + err);
            });

          scannerInstance.current = html5QrCode;
        } else {
          setDecodedText("No camera found.");
        }
      })
      .catch((err) => {
        setDecodedText("Camera error: " + err);
      });

    return () => {
      if (scannerInstance.current) {
        scannerInstance.current
          .stop()
          .then(() => scannerInstance.current.clear())
          .catch(() => {});
      }
    };
  }, [isScriptLoaded]);

  return (
    <div style={styles.container}>
      <h2>QR Code Scanner</h2>
      <div id="reader" style={styles.reader}></div>
      <p style={styles.result}>{decodedText}</p>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial",
    textAlign: "center",
    padding: "2rem",
  },
  reader: {
    width: "300px",
    margin: "0 auto",
  },
  result: {
    marginTop: "1rem",
    fontSize: "1.2rem",
    color: "green",
    wordBreak: "break-word",
  },
};

export default QRScanner;
