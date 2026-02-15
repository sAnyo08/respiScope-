import React from "react";
import { Check } from "lucide-react";

export default function RecordingInstructions({ currentStep = 1 }) {
  const steps = [
    { id: 1, label: "Connect\nDevice" },
    { id: 2, label: "Position\nCorrectly" },
    { id: 3, label: "Start\nRecording" },
    { id: 4, label: "Analyze\nResults" },
    { id: 5, label: "Share with\nDoctor" },
  ];

  return (
    <div className="bg-teal-50 rounded-lg p-6 mb-8">
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-8 right-8 h-0.5 bg-teal-200"></div>
          <div
            className="absolute top-4 left-8 h-0.5 bg-teal-700 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          ></div>

          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 transition-all duration-300 ${
                  step.id < currentStep
                    ? "bg-teal-700 text-white"
                    : step.id === currentStep
                      ? "bg-teal-600 text-white ring-4 ring-teal-200"
                      : "bg-teal-200 text-teal-700"
                }`}
              >
                {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span className="text-xs text-gray-600 text-center whitespace-pre-line">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Heart & Lung Sound Recording</h3>
        <p className="text-gray-600">Record your heart and lung sounds for medical analysis</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center text-white font-semibold">
              1
            </div>
            <h4 className="font-semibold text-gray-800">Position Device</h4>
          </div>
          <p className="text-gray-600">
            Place the IoT stethoscope on your chest for heart sounds or back for lung sounds
          </p>
        </div>

        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center text-white font-semibold">
              2
            </div>
            <h4 className="font-semibold text-gray-800">Stay Still</h4>
          </div>
          <p className="text-gray-600">Remain quiet and still during the 10-second recording period</p>
        </div>
      </div>
    </div>
  );
}
