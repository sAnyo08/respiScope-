import { useEffect } from "react";

export default function LiveAudioStream() {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000/iot-stream");
    socket.binaryType = "arraybuffer";

    const audioContext = new AudioContext();

    socket.onmessage = (event) => {
      const int16Data = new Int16Array(event.data);
      const floatData = new Float32Array(int16Data.length);

      for (let i = 0; i < int16Data.length; i++) {
        floatData[i] = int16Data[i] / 32768;
      }

      const buffer = audioContext.createBuffer(1, floatData.length, 8000);
      buffer.copyToChannel(floatData, 0);

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    };

    return () => socket.close();
  }, []);

  return null;
}
