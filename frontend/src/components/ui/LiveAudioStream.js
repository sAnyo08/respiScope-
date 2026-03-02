import { useEffect, useRef } from "react";

export default function LiveAudioStream() {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000/iot-stream");
    socket.binaryType = "arraybuffer";

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Waveform state
    let dataBuffer = new Float32Array(canvas.width);
    let xOffset = 0;

    // Setup canvas style
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 4;
    ctx.shadowColor = "#32cd32";

    const drawWaveform = (newSamples) => {
      // Shift old data to the left by the number of new samples
      const shiftLength = Math.min(newSamples.length, dataBuffer.length);

      dataBuffer.copyWithin(0, shiftLength);
      dataBuffer.set(newSamples.slice(-shiftLength), dataBuffer.length - shiftLength);

      // Redraw entire canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      const centerY = canvas.height / 2;

      for (let i = 0; i < dataBuffer.length; i++) {
        const x = i;
        // Float data is -1 to 1. Scale to canvas height.
        // Add a scaling factor (e.g., 2.0) to make the wave more visible if it's quiet
        const y = centerY - dataBuffer[i] * (canvas.height / 2) * 2.0;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    };

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const audioContext = audioContextRef.current;

    socket.onmessage = (event) => {
      const int16Data = new Int16Array(event.data);
      const floatData = new Float32Array(int16Data.length);

      for (let i = 0; i < int16Data.length; i++) {
        floatData[i] = int16Data[i] / 32768; // Normalize to -1 to 1
      }

      // 1. Play audio
      const buffer = audioContext.createBuffer(1, floatData.length, 8000);
      buffer.copyToChannel(floatData, 0);

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();

      // 2. Draw Visuals
      // Downsample floatData for the canvas (drawing 8000 points per second is too dense)
      // Pick e.g., every 10th sample
      const downsampled = [];
      for (let i = 0; i < floatData.length; i += 10) {
        downsampled.push(floatData[i]);
      }

      // We use requestAnimationFrame to sync drawing with the browser
      requestAnimationFrame(() => drawWaveform(new Float32Array(downsampled)));
    };

    return () => {
      socket.close();
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-40 bg-black rounded-lg overflow-hidden relative shadow-[0_0_15px_rgba(0,255,0,0.2)] border border-green-900/50">
      <div className="absolute top-2 left-3 flex items-center gap-2 z-10">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-red-500 text-xs font-bold tracking-widest font-mono">LIVE REC</span>
      </div>
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <canvas
        ref={canvasRef}
        width={800} // This can be dynamically resized in a more complex setup, using fixed 800 for width to ensure sharp rendering
        height={160}
        className="w-full h-full block"
      />
    </div>
  );
}
