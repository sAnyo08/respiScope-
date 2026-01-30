// src/components/ui/AudioWaveform.jsx
import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const AudioWaveform = ({ fileId }) => {
  const containerRef = useRef(null);
  const waveRef = useRef(null);

  useEffect(() => {
    if (!fileId || !containerRef.current) return;

    let cancelled = false;
    const token = localStorage.getItem("accessToken");

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#c7d2fe",
      progressColor: "#0f766e",
      cursorColor: "#0f766e",
      height: 70,
      barWidth: 2,
      barRadius: 2,
      normalize: true,
      responsive: true,
      backend: "WebAudio", // 🔑 REQUIRED for waveform
    });

    waveRef.current = ws;

    // 🔐 AUTHENTICATED FETCH
    fetch(`http://localhost:5000/message/file/${fileId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        if (!cancelled) {
          ws.loadBlob(blob);
        }
      })
      .catch((err) => {
        console.error("Waveform fetch error:", err);
      });

    return () => {
      cancelled = true;
      try {
        ws.destroy();
      } catch {}
    };
  }, [fileId]);

  return <div ref={containerRef} className="w-full mt-2" />;
};

export default AudioWaveform;
