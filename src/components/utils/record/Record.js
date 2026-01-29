import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Input } from "../../ui/Input";
import {
  Heart,
  Mic,
  User,
  Users,
  Clock,
  LogOut,
  Bluetooth,
  Wifi,
  Share2,
  Calendar,
  Check,
  Activity,
  Radio,
  Play,
  Square,
  AlertCircle,
  FileAudio,
  TrendingUp,
  Stethoscope,
  ChevronRight,
} from "lucide-react";

const stepNames = [
  "Connect Device",
  "Position Device",
  "Record Heart Sounds",
  "Analyze Recording",
  "Share with Doctor",
];

export default function PatientPortal() {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const consultationId = localStorage.getItem("activeConsultationId");
  const token = localStorage.getItem("accessToken");
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [recordings, setRecordings] = useState([]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleToggleRecording = useCallback(async () => {
    if (isRecording) {
      // ⏹️ Stop
      mediaRecorder?.stop();
      mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (timerInterval) clearInterval(timerInterval);
      setTimerInterval(null);
      return;
    }

    // ▶️ Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      setMediaRecorder(recorder);
      setAudioChunks([]);
      setIsRecording(true);
      setTimer(0);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks((prev) => [...prev, e.data]);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

        const formData = new FormData();
        formData.append("file", audioBlob, `heart-sound-${Date.now()}.webm`);
        formData.append("consultationId", consultationId);
        formData.append("messageType", "audio");

        try {
          await fetch("http://localhost:5000/message/file", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          const newRecording = {
            id: Date.now(),
            timestamp: new Date(),
            step: currentStep,
            stepName: stepNames[currentStep - 1],
            duration: 10,
          };

          setRecordings((prev) => [...prev, newRecording]);
          setCurrentStep((prev) => (prev < 5 ? prev + 1 : prev));
        } catch (err) {
          console.error("Upload failed", err);
          alert("Audio upload failed");
        }
      };

      recorder.start();

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev >= 9) {
            recorder.stop();
            clearInterval(interval);
            setTimerInterval(null);
            setIsRecording(false);
            stream.getTracks().forEach((track) => track.stop());
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      setTimerInterval(interval);
    } catch (err) {
      alert("Microphone permission denied");
      console.error(err);
    }
  }, [isRecording, mediaRecorder, audioChunks, timerInterval, currentStep]);

  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  // --- Components ---
  const DeviceConnection = () => (
    <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-2xl p-8 mb-8 border-2 border-teal-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                IoT Stethoscope Device
              </h3>
              <p className="text-sm text-gray-600">
                Smart medical monitoring device
              </p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Connect your IoT stethoscope device to start recording heart and lung sounds
          </p>
          
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-200">
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Device Disconnected</span>
            <span className="text-xs text-gray-500 ml-auto">Waiting for connection...</span>
          </div>
        </div>
        
        <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ml-6 group">
          <Wifi className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
          Connect Device
        </Button>
      </div>
    </div>
  );

  const RecordingInstructions = ({ currentStep }) => {
    const steps = [
      { id: 1, label: "Connect\nDevice", icon: Bluetooth },
      { id: 2, label: "Position\nCorrectly", icon: Activity },
      { id: 3, label: "Start\nRecording", icon: Mic },
      { id: 4, label: "Analyze\nResults", icon: TrendingUp },
      { id: 5, label: "Share with\nDoctor", icon: Share2 },
    ];
    
    return (
      <div className="bg-gradient-to-br from-white to-teal-50 rounded-2xl p-8 mb-8 border-2 border-teal-200 shadow-lg">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative px-4">
            {/* Background line */}
            <div className="absolute top-6 left-8 right-8 h-1 bg-gradient-to-r from-teal-100 to-teal-200 rounded-full"></div>
            
            {/* Progress line */}
            <div
              className="absolute top-6 left-8 h-1 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `calc(${((currentStep - 1) / 4) * 100}% - 2rem)` }}
            ></div>
            
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              
              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold mb-3 transition-all duration-500 shadow-md ${
                      isCompleted
                        ? "bg-gradient-to-br from-teal-600 to-cyan-600 text-white scale-100"
                        : isCurrent
                        ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white ring-4 ring-teal-200 scale-110 shadow-lg"
                        : "bg-white text-gray-400 border-2 border-gray-200"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-6 h-6" />
                    )}
                  </div>
                  <span className="text-xs text-gray-600 text-center whitespace-pre-line font-medium">
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full mb-4">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-semibold">Medical Recording</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Heart & Lung Sound Recording
          </h3>
          <p className="text-gray-600">
            Record your heart and lung sounds for professional medical analysis
          </p>
        </div>

        {/* Instruction Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border-2 border-teal-100 hover:border-teal-300 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                  Position Device
                  <ChevronRight className="w-4 h-4 text-teal-600" />
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Place the IoT stethoscope on your chest for heart sounds or back for lung sounds. Ensure firm contact with skin.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-teal-100 hover:border-teal-300 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                  Stay Still
                  <ChevronRight className="w-4 h-4 text-cyan-600" />
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Remain quiet and still during the 10-second recording period for optimal audio quality.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">Recording Tips</p>
            <p className="text-xs text-blue-700 mt-1">
              For best results, record in a quiet environment and breathe normally. Each recording is automatically 10 seconds long.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const RecordingControls = ({ isRecording, timer, onToggleRecording }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-10 border-2 border-gray-200 shadow-lg mb-8">
      <div className="flex flex-col items-center">
        {/* Recording Button */}
        <div className="relative mb-8">
          {/* Outer pulse rings */}
          {isRecording && (
            <>
              <div className="absolute -inset-4 rounded-full bg-red-400/30 animate-ping"></div>
              <div className="absolute -inset-6 rounded-full bg-red-300/20 animate-ping" style={{ animationDelay: '0.3s' }}></div>
            </>
          )}
          
          {/* Main button */}
          <button
            onClick={onToggleRecording}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center border-8 transition-all duration-300 shadow-2xl ${
              isRecording
                ? "bg-gradient-to-br from-red-500 to-red-600 border-red-400 hover:scale-105"
                : "bg-gradient-to-br from-teal-500 to-cyan-600 border-teal-400 hover:scale-105"
            }`}
          >
            {isRecording ? (
              <Square className="w-12 h-12 text-white fill-white" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </button>
          
          {/* Active recording indicator */}
          {isRecording && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <Radio className="w-4 h-4 text-white animate-pulse" />
            </div>
          )}
        </div>

        {/* Timer Display */}
        <div className="mb-8">
          <div className={`text-6xl font-bold font-mono tracking-wider ${
            isRecording ? "text-red-600" : "text-gray-800"
          }`}>
            {timer}
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-500 font-medium">
              {isRecording ? "Recording in progress..." : "Ready to record"}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onToggleRecording}
          className={`px-10 py-4 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${
            isRecording
              ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              : "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
          }`}
        >
          <Mic className="w-5 h-5 mr-3" />
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>

        {/* Recording Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isRecording 
              ? `Recording will stop automatically in ${10 - timer} seconds` 
              : "Click to begin 10-second recording"
            }
          </p>
        </div>
      </div>
    </div>
  );

  const RecentRecordings = ({ recordings }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
            <FileAudio className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Recent Recordings</h3>
            <p className="text-sm text-gray-600">Your recorded heart and lung sounds</p>
          </div>
        </div>
        <div className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full">
          <span className="text-sm font-bold">{recordings.length} Total</span>
        </div>
      </div>

      {recordings.length > 0 ? (
        <div className="space-y-6">
          {/* Recordings List */}
          <div className="space-y-3">
            {recordings.map((recording, index) => (
              <div
                key={recording.id}
                className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Recording Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                      <Mic className="w-7 h-7 text-white" />
                    </div>
                    
                    {/* Recording Info */}
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg mb-1">
                        {recording.stepName}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{recording.timestamp.toLocaleDateString()}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{recording.duration}s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step Badge */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full font-semibold border border-teal-200">
                      Step {recording.step}
                    </span>
                    <Play className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Share Section */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-200">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-5 h-5 text-teal-600" />
                <h4 className="font-bold text-gray-800">Share with Doctor</h4>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Doctor Code
                    <span className="text-xs text-gray-500 font-normal">(Required)</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter doctor's unique code"
                    className="w-full h-12 text-base border-2 border-gray-300 focus:border-teal-500 rounded-lg"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share All Recordings
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-md">
            <FileAudio className="w-12 h-12 text-gray-400" />
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">No Recordings Yet</h4>
          <p className="text-gray-600 text-center mb-8 max-w-md">
            Start recording your heart and lung sounds to share with your doctor
          </p>
          
          {/* Share Section for Empty State */}
          <div className="w-full max-w-md">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-200">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-5 h-5 text-teal-600" />
                <h4 className="font-bold text-gray-800">Share with Doctor</h4>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Doctor Code
                    <span className="text-xs text-gray-500 font-normal">(Required)</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter doctor's unique code"
                    className="w-full h-12 text-base border-2 border-gray-300 focus:border-teal-500 rounded-lg"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share with Doctor
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // --- Render Page ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-cyan-50">
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Medical Recording Portal
            </h1>
            <p className="text-gray-600 text-lg">
              Record and share your heart and lung sounds with healthcare professionals
            </p>
          </div>

          <DeviceConnection />
          <RecordingInstructions currentStep={currentStep} />
          <RecordingControls
            isRecording={isRecording}
            timer={formatTimer(timer)}
            onToggleRecording={handleToggleRecording}
          />
          <RecentRecordings recordings={recordings} />
        </div>
      </main>
    </div>
  );
}