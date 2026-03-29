import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../utils/Navbar";
import { Helmet } from "react-helmet";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#041d14] via-[#0b2b22] to-[#10141a] text-gray-100 overflow-hidden relative">
      <Helmet>
        <title>RespiScope | AI Respiratory Insights You Can Trust</title>
        <meta name="description" content="AI-powered medical diagnostics and respiratory insights." />
      </Helmet>
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <Navbar userType="landing" userName="" userCode="" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold font-manrope mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-green-400"
          >
            RespiScope Portal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-teal-100/80 max-w-3xl mx-auto font-inter"
          >
            AI-Powered Respiratory Insights You Can Trust. <br/>
            Access secure diagnostic records and AI analysis in one platform.
          </motion.p>
        </div>

        {/* Login Cards */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          
          {/* Doctor Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-teal-400/0 rounded-3xl blur-xl transition-all duration-500 group-hover:blur-2xl group-hover:from-green-400/30" />
            <div className="relative h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-white/10 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 font-manrope">Healthcare Provider</h2>
              <p className="text-teal-100/70 mb-8 font-inter">
                Access patient records, upload stethoscope recordings, and utilize advanced AI diagnostic tools for precise care.
              </p>
              <Link to="/doctor-login" className="w-full mt-auto">
                <button className="w-full py-4 rounded-xl font-bold text-gray-900 bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-300 hover:to-teal-300 transition-all shadow-lg active:scale-95">
                  Login as Doctor
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Patient Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="group relative"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-blue-400/0 rounded-3xl blur-xl transition-all duration-500 group-hover:blur-2xl group-hover:from-teal-400/30" />
            <div className="relative h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-white/10 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 font-manrope">Patient Portal</h2>
              <p className="text-teal-100/70 mb-8 font-inter">
                View your medical records, audio consultation history, and AI diagnostic reports in a highly secure interface.
              </p>
              <Link to="/patient-login" className="w-full mt-auto">
                <button className="w-full py-4 rounded-xl font-bold text-gray-900 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 transition-all shadow-lg active:scale-95">
                  Login as Patient
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-32 max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white font-manrope">The Clinical Prism Difference</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-green-400 mx-auto mt-4 rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl text-center shadow-xl">
              <div className="text-green-400 text-4xl mb-4 text-center mx-auto block w-fit">🔒</div>
              <h4 className="text-xl font-bold text-white mb-3">Military-Grade Security</h4>
              <p className="text-teal-100/60 text-sm">HIPAA-compliant data encryption guarantees your biological insights stay private.</p>
            </div>
            <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl text-center shadow-xl">
              <div className="text-teal-400 text-4xl mb-4 text-center mx-auto block w-fit">⚡</div>
              <h4 className="text-xl font-bold text-white mb-3">AI Diagnostics</h4>
              <p className="text-teal-100/60 text-sm">Trained algorithms instantly detect anomalies in lung audio data.</p>
            </div>
            <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl text-center shadow-xl">
              <div className="text-emerald-400 text-4xl mb-4 text-center mx-auto block w-fit">📡</div>
              <h4 className="text-xl font-bold text-white mb-3">IoT Integration</h4>
              <p className="text-teal-100/60 text-sm">Direct, seamless wireless connection from your RespiScope IoT stethoscope.</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md mt-24 py-8">
        <div className="text-center text-teal-100/50 text-sm font-inter">
          &copy; {new Date().getFullYear()} RespiScope Systems. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;