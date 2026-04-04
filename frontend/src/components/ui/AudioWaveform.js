import { useEffect, useRef } from "react";

/**
 * Ventilator-style Line Graph for Static Audio Files
 * Replaces WaveSurfer with a smooth oscilloscope-style line.
 */
const AudioWaveform = ({ fileId, peaks = [] }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!fileId || !canvasRef.current) return;

    let cancelled = false;
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    const FILE_URL = `${API_URL}/messages/file/public/${fileId}`;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    
    // Draw loading text
    ctx.fillStyle = "#00ff00";
    ctx.font = "12px monospace";
    ctx.fillText("LOADING DATA...", 10, 20);

    fetch(FILE_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.arrayBuffer();
      })
      .then(async (arrayBuffer) => {
        if (cancelled) return;
        
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
          const rawData = audioBuffer.getChannelData(0); // Get first channel
          const duration = audioBuffer.duration || 1;

          // Downsample for performance (approx 1 point per 2 pixels)
          const samples = width * 2;
          const blockSize = Math.floor(rawData.length / samples) || 1;
          const filteredData = [];
          for (let i = 0; i < samples; i++) {
            const index = i * blockSize;
            if (index < rawData.length) {
              filteredData.push(rawData[index]);
            }
          }

          draw(filteredData, duration);
        } catch (decodeError) {
          console.error("Audio decode failed:", decodeError);
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, width, height);
          ctx.fillStyle = "#ff0000";
          ctx.font = "12px monospace";
          ctx.fillText("DECODE ERROR: Unsupported Format", 10, height/2);
        }
      })
      .catch((err) => {
        console.error("Oscilloscope load error:", err);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#ff0000";
        ctx.font = "12px monospace";
        ctx.fillText("LOAD ERROR: Check Connection", 10, height/2);
      });

    const draw = (data, duration) => {
      if (cancelled) return;

      // Clear for draw
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      // Draw Grid
      ctx.strokeStyle = "rgba(156, 156, 156, 0.16)";
      ctx.lineWidth = 1;
      for(let i=0; i<width; i+=40) {
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      }
      for(let i=0; i<height; i+=30) {
          ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }

      // Draw axis labels
      ctx.fillStyle = "rgba(156, 156, 156, 0.8)";
      ctx.font = "10px sans-serif";
      ctx.fillText("Pressure (cmH2O)", 5, 12);
      ctx.fillText("Time (s)", width - 50, height - 5);

      // 🔴 Draw Abnormal Peaks (Markers)
      if (peaks && peaks.length > 0) {
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = "rgba(255, 0, 0, 1)";
        ctx.lineWidth = 1;
        peaks.forEach(time => {
          const peakX = (time / duration) * width;
          ctx.beginPath();
          ctx.moveTo(peakX, 0);
          ctx.lineTo(peakX, height);
          ctx.stroke();
          
          // Peak label
          ctx.fillStyle = "#ff0000";
          ctx.font = "9px monospace";
          ctx.fillText("ANOMALY", peakX + 2, 10);
        });
        ctx.setLineDash([]); // Reset dash
      }

      // Draw Waveform Line
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 1;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "#00ff00";
      
      ctx.beginPath();
      const sliceWidth = width / data.length;
      let x = 0;

      for (let i = 0; i < data.length; i++) {
        const v = data[i]; // -1 to 1
        const y = (height / 2) + (v * (height / 2.2));

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.stroke();
      
      // Add subtle glow overlay
      ctx.fillStyle = "rgba(0, 255, 0, 0.02)";
      ctx.fillRect(0, 0, width, height);
    };

    return () => {
      cancelled = true;
    };
  }, [fileId, peaks]);

  return (
    <div className="w-full h-32 bg-black rounded border border-green-900/30 overflow-hidden shadow-inner">
      <canvas
        ref={canvasRef}
        width={800}
        height={120}
        className="w-full h-full block"
      />
    </div>
  );
};

export default AudioWaveform;
