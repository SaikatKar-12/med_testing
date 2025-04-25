
import React, { useRef, useState, useEffect } from "react";

export default function DamageChecker() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [commentary, setCommentary] = useState("");
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [mode, setMode] = useState("manual");

  useEffect(() => {
    if (mode === "auto") {
      const interval = setInterval(() => {
        captureImage();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  const fetchLogs = async () => {
    const res = await fetch("http://localhost:8000/log");
    const data = await res.json();
    setLogs(data.reverse());
    setShowLogs(true);
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        console.log("Base64 payload:", base64Image.slice(0, 100)); // show first 100 chars
        const res = await fetch("http://localhost:8000/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64Image }),
        });

        const data = await res.json();
if (res.ok) {
  setCommentary(data.commentary || "No commentary available.");
} else {
  setCommentary(`⚠️ Error: ${data.error || "Unexpected error"}`);
}
      };
      reader.readAsDataURL(blob);
    }, "image/jpeg");
  };

  return (
    <div className="flex p-4 gap-6">
      {/* Left: Camera */}
      <div className="flex flex-col items-center">
        <video ref={videoRef} autoPlay className="rounded shadow w-[480px] h-auto" />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div className="flex gap-2 mt-4">
          <button
            onClick={startCamera}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Start Camera
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`px-4 py-2 rounded ${mode === "manual" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            Manual Mode
          </button>
          <button
            onClick={() => setMode("auto")}
            className={`px-4 py-2 rounded ${mode === "auto" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            Auto Mode
          </button>
          {mode === "manual" && (
            <button
              onClick={captureImage}
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              Capture Image
            </button>
          )}
        </div>
      </div>

      {/* Right: Results */}
      <div className="flex-1 max-w-2xl">
        {commentary && (
          <div className="mt-4 p-4 bg-yellow-100 rounded shadow whitespace-pre-wrap">
            <h2 className="font-semibold text-lg mb-2">Inspection Report:</h2>
            <div className="text-sm leading-relaxed">
              {commentary.split("\n").map((line, idx) => {
                if (line.startsWith("**") && line.endsWith("**")) {
                  return <p key={idx} className="text-lg font-bold text-red-700">{line.replaceAll("**", "")}</p>;
                } else if (line.startsWith("* ")) {
                  return <li key={idx} className="ml-4 list-disc">{line.replace("* ", "")}</li>;
                } else {
                  return <p key={idx}>{line}</p>;
                }
              })}
            </div>
          </div>
        )}

        <button
          onClick={fetchLogs}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
        >
          View History
        </button>

        {showLogs && (
          <div className="mt-4 max-h-[300px] overflow-y-auto bg-white shadow rounded p-4 border">
            <h2 className="font-semibold text-lg mb-2">Inspection History</h2>
            {logs.map((log, idx) => (
              <div key={idx} className="mb-3 border-b pb-2">
                <p><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                <p><strong>Report:</strong></p>
                <p className="whitespace-pre-wrap text-sm">{log.commentary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

//export default DamageChecker;