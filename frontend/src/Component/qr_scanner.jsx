import React, { useEffect, useRef, useState } from "react";

const QRScanner = () => {
  const [decodedText, setDecodedText] = useState("Waiting for scan...");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const scannerInstance = useRef(null);

  // List of genuine manufacturers
  const genuineManufacturers = ["Pfizer", "Cipla", "Sun Pharma", "Dr. Reddy's", "Abbott"];

  const loadScript = () => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/html5-qrcode";
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => setDecodedText("❌ Failed to load QR script.");
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadScript();
  }, []);

  useEffect(() => {
    if (!isScriptLoaded || !window.Html5Qrcode) return;

    const html5QrCode = new window.Html5Qrcode("reader");

    const onScanSuccess = async (text) => {
      try {
        const medicineData = JSON.parse(text);

        // Check manufacturer authenticity
        if (!genuineManufacturers.includes(medicineData.manufacturer)) {
          setDecodedText(`❌ Not a genuine manufacturer: ${medicineData.manufacturer}`);
          return;
        }

        // Check for expiry
        const currentDate = new Date();
        const expiryDate = new Date(medicineData.expiry_date);

        if (expiryDate < currentDate) {
          setDecodedText("❌ Medicine is expired and cannot be added.");
          return;
        }

        const response = await fetch("http://localhost:3000/api/v1/medicine", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            name: medicineData.name,
            manufacturer: medicineData.manufacturer,
            batch_number: medicineData.batch_number,
            quantity: medicineData.quantity,
            price: medicineData.price,
            expiry_date: medicineData.expiry_date,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setDecodedText("✅ Medicine added successfully!");
          html5QrCode.stop().then(() => html5QrCode.clear()).catch((err) =>
            setDecodedText("❌ Error stopping the scanner: " + err)
          );
        } else {
          setDecodedText("❌ Failed to add medicine: " + result.message);
        }
      } catch (error) {
        console.error("QR parse error:", error);
        setDecodedText("❌ Invalid QR code data.");
      }
    };

    window.Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices.length) {
          const cameraId = devices[0].id;
          html5QrCode
            .start(cameraId, { fps: 10, qrbox: 250 }, onScanSuccess)
            .catch((err) => setDecodedText("❌ Camera error: " + err));
          scannerInstance.current = html5QrCode;
        } else {
          setDecodedText("❌ No camera found.");
        }
      })
      .catch((err) => setDecodedText("❌ Failed to access camera: " + err));

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
