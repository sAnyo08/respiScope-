import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, Heart, Play, Pause, CheckCircle, 
  ChevronLeft, AlertCircle, Send, User, 
  Calendar, Clock, ClipboardList, Thermometer
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';
import Navbar from '../../utils/Navbar';
import { getConsultationDetails } from '../../../services/api/consultationService';
import { submitReview } from '../../../services/api/reviewService';

const SessionReview = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAudio, setActiveAudio] = useState(null);
  
  // Review Form State
  const [reviewData, setReviewData] = useState({
    diagnosis: "",
    comments: "",
    severity: "low"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getConsultationDetails(consultationId);
        setConsultation(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [consultationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitReview({
        consultationId,
        ...reviewData
      });
      alert("Review submitted successfully!");
      navigate('/doctor-dashboard');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAudio = (audioUrl) => {
    if (activeAudio === audioUrl) {
      setActiveAudio(null);
    } else {
      setActiveAudio(audioUrl);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0b2b22] flex items-center justify-center text-white">Loading session...</div>;
  if (error) return <div className="min-h-screen bg-[#0b2b22] flex items-center justify-center text-red-400">Error: {error}</div>;

  const { patientId, recordingPoints, type, startedAt } = consultation;
  const isLungs = type === 'lungs';

  return (
    <div className="min-h-screen bg-[#041d14] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 text-zinc-400 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Recording Points */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLungs ? 'bg-teal-500/20 text-teal-400' : 'bg-red-500/20 text-red-400'}`}>
                      {isLungs ? <Activity className="w-6 h-6" /> : <Heart className="w-6 h-6" />}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">{isLungs ? 'Lung' : 'Heart'} Session Review</h1>
                      <p className="text-zinc-400 text-sm">Consultation ID: {consultationId.slice(-8)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold flex items-center gap-2 text-zinc-300">
                      <Calendar className="w-4 h-4" /> {new Date(startedAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2 justify-end">
                      <Clock className="w-3 h-3" /> {new Date(startedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <ClipboardList className="w-5 h-5 text-teal-400" />
                    Recording Points ({recordingPoints?.length || 0})
                  </h3>
                  
                  <div className="grid gap-3">
                    {recordingPoints?.map((point, index) => (
                      <div 
                        key={point._id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-xs font-bold border border-white/10">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-sm capitalize">{point.pointName.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-zinc-500">{point.duration} seconds recorded</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant={activeAudio === point.audioUrl ? "default" : "outline"}
                          className={activeAudio === point.audioUrl ? "bg-teal-500" : ""}
                          onClick={() => toggleAudio(point.audioUrl)}
                        >
                          {activeAudio === point.audioUrl ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                          {activeAudio === point.audioUrl ? 'Playing' : 'Listen'}
                        </Button>
                      </div>
                    ))}
                  </div>

                  {activeAudio && (
                    <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl animate-in slide-in-from-bottom-2">
                      <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2">Player Context</p>
                      <audio 
                        src={activeAudio} 
                        controls 
                        autoPlay 
                        className="w-full h-8"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Patient Info Quick View */}
            <Card className="bg-black/40 border-white/10">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                    <User className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{patientId?.name}</h4>
                    <p className="text-sm text-zinc-400">Age: {patientId?.age} • {patientId?.gender}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate(`/patients/${patientId?._id}`)}>
                  View Full History
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Review Form */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-b from-zinc-900 to-black border-white/10 sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Send className="w-5 h-5 text-teal-400" />
                  Submit Feedback
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Severity Assessment</label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setReviewData({...reviewData, severity: lvl})}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize border transition-all
                            ${reviewData.severity === lvl 
                              ? (lvl === 'low' ? 'bg-green-500/20 border-green-500 text-green-400' : 
                                 lvl === 'medium' ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 
                                 'bg-red-500/20 border-red-500 text-red-400')
                              : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'}`}
                        >
                          <Thermometer className="w-3 h-3 mx-auto mb-1" />
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Clinical Diagnosis</label>
                    <input 
                      type="text"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-teal-500/50"
                      placeholder="e.g. Normal Breath Sounds"
                      value={reviewData.diagnosis}
                      onChange={(e) => setReviewData({...reviewData, diagnosis: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Detailed Comments</label>
                    <textarea 
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-teal-500/50"
                      placeholder="Provide detailed feedback for the patient..."
                      rows="6"
                      value={reviewData.comments}
                      onChange={(e) => setReviewData({...reviewData, comments: e.target.value})}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-teal-500 hover:bg-teal-400 text-black font-bold py-6 text-lg shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Complete Review'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-200/60 leading-relaxed">
                Completing this review will notify the patient and mark the session as "Reviewed". Please ensure all points have been carefully auscultated.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SessionReview;
