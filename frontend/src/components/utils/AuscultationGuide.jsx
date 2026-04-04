import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, CheckCircle, ChevronRight, Activity, Info, RefreshCcw, Heart } from 'lucide-react';
import { Button } from '../ui/Button';

// Importing the newly generated images
import BodyModelLungs from '../../assets/images/model_lungs.png';
import BodyModelHeart from '../../assets/images/model_heart.png';

const AUSCULTATION_POINTS = {
  lungs: [
    { id: 1, name: "Right Bronchial", desc: "Loud, high-pitched sounds around the trachea.", x: 44, y: 29 },
    { id: 2, name: "Left Bronchial", desc: "Loud, high-pitched sounds around the trachea.", x: 56, y: 29 },
    { id: 3, name: "Left Bronchovesicular", desc: "Medium-pitched sounds, 1st/2nd intercostal space.", x: 56, y: 37 },
    { id: 4, name: "Right Bronchovesicular", desc: "Medium-pitched sounds, 1st/2nd intercostal space.", x: 44, y: 37 },
    { id: 5, name: "Right Vesicular (Upper)", desc: "Soft, low-pitched sounds in upper lung field.", x: 40, y: 45 },
    { id: 6, name: "Left Vesicular (Upper)", desc: "Soft, low-pitched sounds in upper lung field.", x: 60, y: 45 },
    { id: 7, name: "Left Vesicular (Middle)", desc: "Soft, low-pitched sounds in middle lung field.", x: 62, y: 53 },
    { id: 8, name: "Right Vesicular (Middle)", desc: "Soft, low-pitched sounds in middle lung field.", x: 38, y: 53 },
    { id: 9, name: "Right Vesicular (Lower)", desc: "Soft, low-pitched sounds at lung bases.", x: 38, y: 60 },
    { id: 10, name: "Left Vesicular (Lower)", desc: "Soft, low-pitched sounds at lung bases.", x: 62, y: 60 },
  ],
  heart: [
    { id: 1, name: "Aortic Area", desc: "Right of sternum at 2nd intercostal space.", x: 48, y: 36 },
    { id: 2, name: "Pulmonic Area", desc: "Left of sternum at 2nd intercostal space.", x: 52, y: 36 },
    { id: 3, name: "Erb's Point", desc: "Left of sternum at 3rd intercostal space.", x: 52, y: 39 },
    { id: 4, name: "Tricuspid Area", desc: "Left of sternum at 4th intercostal space.", x: 52, y: 43 },
    { id: 5, name: "Mitral Area", desc: "Left of sternum at 5th intercostal space on midclavicular line.", x: 57, y: 49 }
  ]
};

const RECORDING_DURATION = 8; // seconds

const AuscultationGuide = () => {
  const [activeOrgan, setActiveOrgan] = useState('lungs'); // 'lungs' or 'heart'
  const [activeStep, setActiveStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(RECORDING_DURATION);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Reset state when organ tab changes
  useEffect(() => {
    setActiveStep(0);
    setIsRecording(false);
    setTimeLeft(RECORDING_DURATION);
    setCompletedSteps([]);
  }, [activeOrgan]);

  // Handle the countdown timer
  useEffect(() => {
    let timer;
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRecording && timeLeft === 0) {
      setIsRecording(false);
      if (!completedSteps.includes(activeStep)) {
        setCompletedSteps((prev) => [...prev, activeStep]);
      }
    }
    return () => clearInterval(timer);
  }, [isRecording, timeLeft, activeStep, completedSteps]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeLeft(RECORDING_DURATION);
  };

  const currentPointsArray = AUSCULTATION_POINTS[activeOrgan];

  const handleNextStep = () => {
    if (activeStep < currentPointsArray.length - 1) {
      setActiveStep(activeStep + 1);
      setIsRecording(false);
      setTimeLeft(RECORDING_DURATION);
    }
  };

  const currentPoint = currentPointsArray[activeStep];
  const progressPercent = ((RECORDING_DURATION - timeLeft) / RECORDING_DURATION) * 100;

  // Theme Constants
  const isLungs = activeOrgan === 'lungs';
  const themeColor = isLungs ? 'teal' : 'red';
  const themeHex = isLungs ? 'rgba(45, 212, 191, 1)' : 'rgba(248, 113, 113, 1)';
  const themeHexFaded = isLungs ? 'rgba(45, 212, 191, 0.4)' : 'rgba(239, 68, 68, 0.4)';

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-4 md:p-8 min-h-[700px] relative w-full">
      {/* Dynamic Background Glow Based on activeOrgan */}
      <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${isLungs ? 'bg-teal-500/10' : 'bg-red-500/10'}`} />
      <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${isLungs ? 'bg-emerald-500/5' : 'bg-rose-500/10'}`} />

      {/* Left: 3D Body Visualizer & Tab Nav (Taking up much more width now) */}
      <div className="lg:w-2/3 xl:w-3/4 order-2 lg:order-1 flex flex-col gap-6">
        
        {/* Toggle Nav */}
        <div className="flex items-center gap-4 border border-white/10 rounded-2xl p-2 bg-white/5 backdrop-blur-md w-full max-w-md mx-auto">
          <Button 
            variant="ghost" 
            className={`flex-1 rounded-xl transition-all duration-300 ${isLungs ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.2)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => setActiveOrgan('lungs')}
          >
            <Activity className="w-4 h-4 mr-2" />
            Lungs
          </Button>
          <Button 
            variant="ghost" 
            className={`flex-1 rounded-xl transition-all duration-300 ${!isLungs ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(248,113,113,0.2)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => setActiveOrgan('heart')}
          >
            <Heart className="w-4 h-4 mr-2" />
            Heart
          </Button>
        </div>

        {/* The Body Frame */}
        <div className="flex-1 relative bg-black/40 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center min-h-[600px] shadow-2xl">
          {/* Animated Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.05] z-0" 
            style={{ 
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}
          />

          <div className="relative w-full h-full max-w-5xl flex items-center justify-center p-2 z-10 transition-all duration-500">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeOrgan}
                src={isLungs ? BodyModelLungs : BodyModelHeart}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                alt={`Human Anatomy ${activeOrgan}`} 
                className="w-auto h-full max-h-[800px] object-contain drop-shadow-[0_0_30px_rgba(0,0,0,1)] mix-blend-screen"
              />
            </AnimatePresence>

            {/* SVG Overlay for Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 15 }}>
              <AnimatePresence>
                {currentPointsArray.map((point, index) => {
                  if (index === 0) return null;
                  const prev = currentPointsArray[index - 1];
                  const isPastLine = index <= activeStep;
                  return (
                    <motion.line
                      key={`line-${activeOrgan}-${index}`}
                      x1={`${prev.x}%`}
                      y1={`${prev.y}%`}
                      x2={`${point.x}%`}
                      y2={`${point.y}%`}
                      stroke={isPastLine ? themeHexFaded : "rgba(255, 255, 255, 0.05)"}
                      strokeWidth="2.5"
                      strokeDasharray="6 6"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  );
                })}
              </AnimatePresence>
            </svg>

            {/* Glowing Stepladder Dots */}
            {currentPointsArray.map((point, index) => {
              const isActive = index === activeStep;
              const isCompleted = completedSteps.includes(index) || index < activeStep;
              
              // Colors based on theme
              const activeBg = isLungs ? 'bg-teal-400' : 'bg-red-400';
              const activeBorder = isLungs ? 'border-white' : 'border-white';
              const activeShadow = isLungs ? 'shadow-[0_0_20px_rgba(45,212,191,1)]' : 'shadow-[0_0_20px_rgba(248,113,113,1)]';
              
              const completedBg = isLungs ? 'bg-emerald-500' : 'bg-rose-500';
              const completedBorder = isLungs ? 'border-emerald-300' : 'border-rose-300';
              const completedShadow = isLungs ? 'shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'shadow-[0_0_10px_rgba(225,29,72,0.8)]';

              return (
                <div 
                  key={`${activeOrgan}-${point.id}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  onClick={() => {
                    setActiveStep(index);
                    setIsRecording(false);
                    setTimeLeft(RECORDING_DURATION);
                  }}
                >
                  {/* Ping animation for active point */}
                  {isActive && isRecording && (
                    <div className={`absolute inset-0 w-8 h-8 -left-2 -top-2 rounded-full animate-ping opacity-75 ${activeBg}`} />
                  )}
                  
                  {/* Core Dot */}
                  <div 
                    className={`nav-dot w-4 h-4 rounded-full border-2 transition-all duration-300 relative z-10 flex items-center justify-center
                      ${isActive 
                        ? `${activeBg} ${activeBorder} ${activeShadow} scale-150` 
                        : isCompleted 
                          ? `${completedBg} ${completedBorder} ${completedShadow}` 
                          : 'bg-white/20 border-white/40 hover:bg-white/40'
                      }
                    `}
                  >
                    {isCompleted && !isActive && (
                      <CheckCircle className="w-2.5 h-2.5 text-white" />
                    )}
                  </div>
                  
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl px-4 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap shadow-2xl z-50
                        ${isLungs ? 'border-teal-500/50 text-teal-300' : 'border-red-500/50 text-red-300'}`}
                    >
                      {point.name}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Tracking Panel (Smaller fixed width array) */}
      <div className="lg:w-1/3 xl:w-1/4 order-1 lg:order-2 flex flex-col z-10">
        
        <div className="mb-6 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold font-orbitron text-white flex items-center gap-2">
            {isLungs ? <Activity className="w-6 h-6 text-teal-400" /> : <Heart className="w-6 h-6 text-red-400" />}
            {activeOrgan === 'lungs' ? 'Lung' : 'Heart'} Guide
          </h2>
          <p className="text-sm text-zinc-400 mt-2 flex items-start gap-1">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-60" />
            {isLungs ? "Follow the stepladder pattern. Record for 8 seconds at each point." : "Record 8 seconds at the 5 main cardiac auscultation zones."}
          </p>
        </div>

        {/* Current Target Card */}
        <div className={`bg-gradient-to-br from-white/5 to-transparent border backdrop-blur-md rounded-2xl p-6 mb-6 transition-colors duration-500 ${isLungs ? 'border-teal-500/30 hover:border-teal-400/50' : 'border-red-500/30 hover:border-red-400/50'}`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/40 ${isLungs ? 'text-teal-300' : 'text-red-300'}`}>
              Phase {activeStep + 1} / {currentPointsArray.length}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{currentPoint.name}</h3>
          <p className="text-sm text-zinc-300">{currentPoint.desc}</p>
          
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2 font-medium">
              <span className={isRecording ? (isLungs ? "text-teal-300 animate-pulse" : "text-red-300 animate-pulse") : "text-white"}>
                {isRecording ? "Recording in progress..." : "Ready to record"}
              </span>
              <span className="text-white bg-black/50 px-2 py-0.5 rounded font-mono border border-white/10">00:0{timeLeft}</span>
            </div>
            <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-linear
                  ${isRecording 
                    ? (isLungs ? 'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]') 
                    : 'bg-white/10'}
                `}
                style={{ width: `${isRecording ? progressPercent : 0}%` }}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            {!isRecording && timeLeft === RECORDING_DURATION ? (
              <Button 
                onClick={handleStartRecording} 
                className={`flex-1 font-bold border-none transition-all duration-300 text-black
                  ${isLungs 
                    ? 'bg-teal-500 hover:bg-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_20px_rgba(20,184,166,0.5)]' 
                    : 'bg-red-500 hover:bg-red-400 shadow-[0_0_15px_rgba(248,113,113,0.3)] hover:shadow-[0_0_20px_rgba(248,113,113,0.5)]'
                  }
                `}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            ) : isRecording ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  // Simulate Manual Pause / Cancellation
                  setIsRecording(false);
                  setTimeLeft(RECORDING_DURATION);
                }}
                className="flex-1 bg-black/40 border-zinc-500/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <Pause className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            ) : (
              // Done recording this step
              <Button 
                onClick={handleNextStep}
                disabled={activeStep === currentPointsArray.length - 1}
                className={`flex-1 font-bold border-none transition-all text-white
                  ${isLungs ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'}
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Next Point
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
            
            {timeLeft < RECORDING_DURATION && !isRecording && (
              <Button onClick={() => setTimeLeft(RECORDING_DURATION)} variant="outline" className="px-3 bg-black/40" title="Retry">
                <RefreshCcw className="w-4 h-4 text-zinc-300" />
              </Button>
            )}
          </div>
        </div>

        {/* List of Points */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
          {currentPointsArray.map((point, index) => {
            const isCompleted = completedSteps.includes(index);
            const isActive = index === activeStep;
            
            const activeBgClass = isLungs ? 'bg-teal-500/10 border-teal-500/50 shadow-inner' : 'bg-red-500/10 border-red-500/50 shadow-inner';
            const textClass = isLungs ? 'text-teal-300' : 'text-red-300';
            const iconBgClass = isLungs ? 'bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.3)]' : 'bg-red-500 shadow-[0_0_10px_rgba(248,113,113,0.3)]';
            const completeBgClass = isLungs ? 'bg-emerald-500' : 'bg-rose-500';

            return (
              <div 
                key={`${activeOrgan}-${point.id}`}
                className={`flex items-center p-3 rounded-xl border transition-all duration-300
                  ${isActive 
                    ? activeBgClass 
                    : isCompleted
                      ? 'bg-white/5 border-white/10 opacity-70'
                      : 'bg-black/20 border-white/5 opacity-50 hover:opacity-100 hover:bg-white/10 cursor-pointer'
                  }
                `}
                onClick={() => {
                  if (!isRecording) {
                    setActiveStep(index);
                    setTimeLeft(RECORDING_DURATION);
                  }
                }}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-3 border transition-colors
                  ${isCompleted ? `${completeBgClass} text-white border-transparent` 
                    : isActive ? `${iconBgClass} text-black border-transparent` 
                    : 'border-white/20 text-white/40'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-semibold transition-colors ${isActive ? textClass : 'text-zinc-200'}`}>
                    {point.name}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AuscultationGuide;
