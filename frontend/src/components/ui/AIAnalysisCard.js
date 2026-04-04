import React from 'react';
import { Activity, ShieldAlert, CheckCircle, ZoomIn } from 'lucide-react';

const AIAnalysisCard = ({ analysis }) => {
  if (!analysis) return null;

  const isCompleted = analysis.status === 'completed' || !!analysis.label;
  const isPending = analysis.status === 'pending' && !analysis.label;
  const isFailed = analysis.status === 'failed';

  if (!isCompleted && !isPending && !isFailed) return null;

  if (isPending) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3 animate-pulse">
        <Activity className="w-5 h-5 text-blue-500 animate-spin" />
        <p className="text-sm text-blue-700 font-medium">AI Analysis in progress...</p>
      </div>
    );
  }

  if (analysis.status === 'failed') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-red-500" />
        <p className="text-sm text-red-700 font-medium">AI Analysis failed. Please retry.</p>
      </div>
    );
  }

  const getConfidenceColor = (score) => {
    if (score > 0.8) return 'text-green-600';
    if (score > 0.5) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white border-2 border-teal-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Activity className="w-4 h-4" />
          <span className="text-xs font-bold tracking-wider uppercase">AI Diagnostic Insight</span>
        </div>
        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
          <CheckCircle className="w-3 h-3 text-white" />
          <span className="text-[10px] text-white font-medium">Verified Model</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase mb-1">Detected Condition</p>
            <h4 className="text-xl font-bold text-gray-800">{analysis.label}</h4>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium uppercase mb-1">Confidence</p>
            <p className={`text-lg font-bold ${getConfidenceColor(analysis.confidence)}`}>
              {(analysis.confidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {analysis.spectrogram && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 font-medium uppercase">Acoustic Fingerprint (Mel-Spectrogram)</p>
              <button className="text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors">
                <ZoomIn className="w-3 h-3" />
                <span className="text-[10px] font-bold">Enlarge</span>
              </button>
            </div>
            <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-black">
              <img 
                src={`data:image/png;base64,${analysis.spectrogram}`} 
                alt="AI Spectrogram" 
                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>
        )}

        {analysis.peaks && analysis.peaks.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 font-medium uppercase mb-2">Detected Anomalies ({analysis.peaks.length})</p>
            <div className="flex flex-wrap gap-2">
              {analysis.peaks.slice(0, 5).map((peak, i) => (
                <span key={i} className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100">
                  {peak.toFixed(2)}s
                </span>
              ))}
              {analysis.peaks.length > 5 && (
                <span className="text-[10px] text-gray-400 self-center">+{analysis.peaks.length - 5} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysisCard;
