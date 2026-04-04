import { useEffect, useRef, useState } from "react";

/**
 * Ventilator-style Line Graph (Sweep)
 * - Smoother line (moving sweep bar)
 * - Real-time playback
 */
export default function LiveAudioStream({ consultationId }) {
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const [isMonitoring, setIsMonitoring] = useState(false);

    useEffect(() => {
        if (!isMonitoring) return;

        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
        const WS_URL = API_URL.replace("http", "ws").replace("/api", "/iot-stream") + `?consultationId=${consultationId}&device=browser`;

        const socket = new WebSocket(WS_URL);
        socket.onopen = () => {
            socket.send("START");
        };
        socket.binaryType = "arraybuffer";

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;

        let sweepX = 0;
        const samplesPerPixel = 5;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        const drawSweep = (floatData) => {
            ctx.strokeStyle = "#00ff00";
            ctx.lineWidth = 2;
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#00ff00";

            ctx.fillStyle = "#000000";
            ctx.fillRect(sweepX, 0, 25, height); 

            ctx.beginPath();
            for (let i = 0; i < floatData.length; i += samplesPerPixel) {
                const val = floatData[i] || 0;
                const y = centerY - val * (height / 2.5); 
                
                if (i === 0) ctx.moveTo(sweepX, y);
                else ctx.lineTo(sweepX, y);
                
                sweepX += 1;
                if (sweepX >= width) {
                    sweepX = 0;
                    ctx.fillRect(0, 0, 25, height);
                    ctx.moveTo(0, y);
                }
            }
            ctx.stroke();
        };

        socket.onmessage = (event) => {
            const int16Data = new Int16Array(event.data);
            const floatData = new Float32Array(int16Data.length);

            for (let i = 0; i < int16Data.length; i++) {
                floatData[i] = int16Data[i] / 32768; 
            }

            // Playback
            if (audioContextRef.current && audioContextRef.current.state === 'running') {
                const buffer = audioContextRef.current.createBuffer(1, floatData.length, 8000);
                buffer.copyToChannel(floatData, 0);
                const source = audioContextRef.current.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContextRef.current.destination);
                source.start();
            }

            // Visuals
            requestAnimationFrame(() => drawSweep(floatData));
        };

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send("STOP");
            }
            socket.close();
        };
    }, [consultationId, isMonitoring]);

    const toggleMonitor = async () => {
        if (!isMonitoring) {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
                    sampleRate: 8000
                });
            }
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }
            setIsMonitoring(true);
        } else {
            setIsMonitoring(false);
            if (audioContextRef.current) {
                await audioContextRef.current.suspend();
            }
        }
    };

    return (
        <div className="w-full h-48 bg-black rounded-xl overflow-hidden relative border-2 border-green-900/30 shadow-[0_0_20px_rgba(0,255,0,0.15)]">
            {/* HUD Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
                <button 
                    onClick={toggleMonitor}
                    className={`flex items-center gap-2 px-3 py-1 rounded border transition-colors ${
                        isMonitoring 
                        ? "bg-red-500/20 border-red-500 text-red-500" 
                        : "bg-green-500/20 border-green-500 text-green-500"
                    }`}
                >
                    <div className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
                    <span className="text-[10px] font-bold tracking-[0.1em] font-mono">
                        {isMonitoring ? "STOP MONITOR" : "START MONITOR"}
                    </span>
                </button>
                <div className="px-2 py-1 bg-black/50 rounded border border-green-500/50">
                    <span className="text-green-500 text-[10px] font-mono">8.0kHz / 16-bit</span>
                </div>
            </div>

            {/* CRT Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] z-20" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />

            <canvas
                ref={canvasRef}
                width={1000}
                height={200}
                className="w-full h-full block image-pixelated"
            />
        </div>
    );
}
