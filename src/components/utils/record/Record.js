import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Input } from "../../ui/Input";
//import { Label } from "./components/ui/p";
import { Heart, Mic, User, Users, Clock, LogOut, Bluetooth, Wifi, Share2, Calendar, Check } from "lucide-react";

const stepNames = ["Connect Device", "Position Device", "Record Heart Sounds", "Analyze Recording", "Share with Doctor"];

export default function PatientPortal() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [recordings, setRecordings] = useState([]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      if (timerInterval) clearInterval(timerInterval);
      setTimerInterval(null);
      setTimer(0);
    } else {
      setIsRecording(true);
      setTimer(0);
      const interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev + 1;
          if (newTime >= 10) {
            setIsRecording(false);
            clearInterval(interval);
            setTimerInterval(null);

            const newRecording = {
              id: `recording-${Date.now()}`,
              timestamp: new Date(),
              step: currentStep,
              stepName: stepNames[currentStep - 1],
              duration: 10,
            };
            setRecordings((prev) => [...prev, newRecording]);

            setTimeout(() => {
              setCurrentStep((prevStep) => {
                const nextStep = prevStep < 5 ? prevStep + 1 : prevStep;
                setTimer(0);
                return nextStep;
              });
            }, 500);

            return 0;
          }
          return newTime;
        });
      }, 1000);

      setTimerInterval(interval);
    }
  }, [isRecording, timerInterval, currentStep]);

  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  // --- Components ---
  const DeviceConnection = () => (
    <div className="bg-teal-50 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Bluetooth className="w-5 h-5 text-teal-700" />
            <h3 className="text-lg font-semibold text-gray-800">IoT Stethoscope Device</h3>
          </div>
          <p className="text-gray-600 mb-4">Connect your IoT stethoscope device to start recording</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600">Device Disconnected</span>
          </div>
        </div>
        <Button className="bg-teal-700 hover:bg-teal-800 text-white px-6">
          <Wifi className="w-4 h-4 mr-2" />
          Connect Device
        </Button>
      </div>
    </div>
  );

  const RecordingInstructions = ({ currentStep }) => {
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
  };

  const RecordingControls = ({ isRecording, timer, onToggleRecording }) => (
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
        className={`px-8 py-3 text-white ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-teal-700 hover:bg-teal-800"}`}
      >
        <Mic className="w-4 h-4 mr-2" />
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
    </div>
  );

  const RecentRecordings = ({ recordings }) => (
    <div className="bg-teal-50 rounded-lg p-6 mt-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Recordings</h3>
        <p className="text-gray-600">Your recorded heart and lung sounds</p>
      </div>

      {recordings.length > 0 ? (
        <div className="space-y-4">
          {recordings.map((recording) => (
            <div key={recording.id} className="bg-white rounded-lg p-4 border border-teal-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{recording.stepName}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{recording.timestamp.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{recording.duration}s</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">Step {recording.step}</span>
              </div>
            </div>
          ))}

          <div className="mt-6 pt-4 border-t border-teal-200">
            <div className="space-y-4">
              <div className="space-y-2">
                <p htmlFor="doctor-code" className="text-sm font-medium text-gray-700">
                  Doctor Code
                </p>
                <Input id="doctor-code" type="text" placeholder="Enter doctor's code to share" className="w-full" />
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                <Share2 className="w-4 h-4 mr-2" />
                Share with Doctor
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mb-4">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 text-lg mb-6">No recordings yet</p>
          <div className="w-full max-w-sm space-y-4">
            <div className="space-y-2">
              <p htmlFor="doctor-code" className="text-sm font-medium text-gray-700">
                Doctor Code
              </p>
              <Input id="doctor-code" type="text" placeholder="Enter doctor's code to share" className="w-full" />
            </div>
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Share with Doctor
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  // --- Render Page ---
  return (
    <div className="min-h-screen bg-teal-50">

      {/* Main Content */}
      <main>
        <div className="max-w-6xl mx-auto space-y-6">
          <Card className="p-6 bg-white shadow-sm">
            <DeviceConnection />
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <RecordingInstructions currentStep={currentStep} />
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <RecordingControls
              isRecording={isRecording}
              timer={formatTimer(timer)}
              onToggleRecording={handleToggleRecording}
            />
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <RecentRecordings recordings={recordings} />
          </Card>
        </div>
      </main>
    </div>
  );
}
