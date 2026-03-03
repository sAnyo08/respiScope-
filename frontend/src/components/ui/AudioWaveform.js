import { useEffect, useRef } from "react";

/**
 * Ventilator-style Line Graph for Static Audio Files
 * Replaces WaveSurfer with a smooth oscilloscope-style line.
 */
const AudioWaveform = ({ fileId }) => {
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
      .then((res) => res.arrayBuffer())
      .then(async (arrayBuffer) => {
        if (cancelled) return;
        
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        const rawData = audioBuffer.getChannelData(0); // Get first channel

        // Downsample for performance (approx 1 point per 2 pixels)
        const samples = width * 2;
        const blockSize = Math.floor(rawData.length / samples);
        const filteredData = [];
        for (let i = 0; i < samples; i++) {
          filteredData.push(rawData[i * blockSize]);
        }

        draw(filteredData);
      })
      .catch((err) => {
        console.error("Oscilloscope load error:", err);
      });

    const draw = (data) => {
      if (cancelled) return;

      // Clear for draw
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      // Draw Grid
      ctx.strokeStyle = "rgba(0, 255, 0, 0.05)";
      ctx.lineWidth = 1;
      for(let i=0; i<width; i+=40) {
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      }
      for(let i=0; i<height; i+=40) {
          ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }

      // Draw Line
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 1.5;
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
  }, [fileId]);

  return (
    <div className="w-full h-24 bg-black rounded border border-green-900/30 overflow-hidden shadow-inner">
      <canvas
        ref={canvasRef}
        width={800}
        height={100}
        className="w-full h-full block"
      />
    </div>
  );
};

export default AudioWaveform;
