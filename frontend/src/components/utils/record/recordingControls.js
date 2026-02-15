import React from "react";
import { Button } from "../../ui/Button";
import { Mic } from "lucide-react";

export default function RecordingControls({ isRecording = false, timer = "00:00", onToggleRecording }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-6">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${
            isRecording ? "bg-red-500 border-red-600" : "bg-teal-700 border-teal-800"
          }`}
        >
          <Mic className="w-8 h-8 text-white" />
        </div>
        {isRecording && <div className="absolute -inset-2 rounded-full border-4 border-red-300 animate-pulse"></div>}
      </div>

      <div className="text-3xl font-mono font-bold text-gray-800 mb-6">{timer}</div>

      <Button
        onClick={onToggleRecording}
        className={`px-8 py-3 text-white ${
          isRecording ? "bg-red-600 hover:bg-red-700" : "bg-teal-700 hover:bg-teal-800"
        }`}
      >
        <Mic className="w-4 h-4 mr-2" />
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
    </div>
  );
}
