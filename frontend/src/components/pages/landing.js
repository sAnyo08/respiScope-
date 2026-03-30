import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Facebook, Instagram, ArrowUpRight, ArrowRight, ShieldCheck, Activity, Wifi } from "lucide-react";
import heroBodyImage from "../../assets/images/hero-body-lungs.png";

const Landing = () => {
  return (
    <div className="bg-gradient-to-br from-[#041d14] via-[#0b2b22] to-[#10141a] text-gray-100 overflow-x-hidden font-inter relative">
      <Helmet>
        <title>RespiScope | Next-Gen Respiratory Monitoring</title>
        <meta name="description" content="AI-powered medical diagnostics and respiratory insights." />
      </Helmet>

      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* --- HERO SECTION --- (Full Screen) */}
      <section className="min-h-screen flex flex-col relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Navbar */}
        <header className="py-6 flex items-center justify-between">
          <div className="flex items-center gap-1 font-extrabold text-3xl tracking-tighter cursor-pointer">
            <span className="text-cyan-400">Respi</span>
            <span className="text-white">Scope</span>
          </div>
        </header>

        {/* Hero Content */}
        <div className="flex-1 flex w-full absolute inset-0 pt-[80px]">
          
          {/* Left Text Column */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center relative z-20 px-4 sm:px-6 lg:px-12 pointer-events-auto pb-20">
            
            {/* Avatars + Clients Metric */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#0b101e] flex items-center justify-center text-[10px] font-bold text-teal-400">Dr.<br/>Vatsal</div>
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#0b101e] flex items-center justify-center text-[10px] font-bold text-cyan-400">Dr.<br/>Sanyo</div>
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#0b101e] flex items-center justify-center text-[10px] font-bold text-green-400">Dr.<br/>Allan</div>
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#0b101e] flex items-center justify-center text-[10px] font-bold text-green-400 tracking-tighter">Dr.<br/>Adarsh</div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-light text-white leading-none tracking-tight">+10K</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">PATIENTS</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-7xl font-light tracking-tighter text-white mb-6 leading-[1.05]"
            >
              Next-Gen <br />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-green-400 to-cyan-400">Respiratory <br className="hidden lg:block"/> Monitoring</span> <br />
              with AI Precision
            </motion.h1>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-slate-400 max-w-sm text-lg leading-relaxed mb-10"
            >
              RespiScope helps you track, understand, and act on your respiratory health — with smart AI insights and clean dashboards.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a 
                href="#portal" 
                className="group flex items-center w-fit bg-white rounded-full p-2 pl-6 pr-2 hover:bg-slate-200 transition-colors shadow-2xl shadow-cyan-500/20"
              >
                <span className="text-[#0b101e] font-semibold text-sm tracking-wide mr-6">Login / Dashboard</span>
                <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="text-[#0b101e] w-5 h-5" />
                </div>
              </a>
            </motion.div>
          </div>

          {/* Right Image Column */}
          <div className="absolute top-0 right-0 w-full lg:w-[55%] h-full flex items-end justify-end pointer-events-none opacity-50 lg:opacity-100 z-0">
            <motion.img 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src={heroBodyImage} 
              alt="Glowing Human Anatomy" 
              className="w-full h-[100%] object-cover object-right mix-blend-screen opacity-90 filter drop-shadow-[0_0_80px_rgba(45,212,191,0.2)]"
              style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
            />
          </div>
        </div>
      </section>

      {/* --- LOGIN PORTAL & FEATURES SECTION --- */}
      <section id="portal" className="py-24 relative z-20 border-t border-white/5 bg-[#0b2b22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-white mb-4">Select your Portal</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto rounded-full" />
          </div>

          {/* Login Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Doctor Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-transparent rounded-3xl blur-md transition-all group-hover:blur-xl group-hover:from-teal-400/20" />
              <div className="relative h-full bg-[#0b2b22] border border-white/5 rounded-3xl p-8 lg:p-12 flex flex-col items-start transition-transform group-hover:-translate-y-1">
                <div className="w-14 h-14 bg-teal-400/10 rounded-2xl flex items-center justify-center mb-6 border border-teal-400/20">
                  <Activity className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">Healthcare Provider</h3>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                  Access patient records, upload stethoscope recordings, and utilize advanced AI diagnostic tools for precise care.
                </p>
                <Link to="/doctor-login" className="w-full mt-auto">
                  <button className="w-full py-4 rounded-xl font-bold text-[#0b101e] bg-teal-400 hover:bg-teal-300 transition-colors shadow-lg active:scale-95 flex justify-center items-center gap-2">
                    Login as Doctor <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Patient Card */}
            <div className="group relative">
               <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-3xl blur-md transition-all group-hover:blur-xl group-hover:from-cyan-400/20" />
              <div className="relative h-full bg-[#0b2b22] border border-white/5 rounded-3xl p-8 lg:p-12 flex flex-col items-start transition-transform group-hover:-translate-y-1">
                <div className="w-14 h-14 bg-cyan-400/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-400/20">
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">Patient Portal</h3>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                  View your medical records, audio consultation history, and AI diagnostic reports in a highly secure interface.
                </p>
                <Link to="/patient-login" className="w-full mt-auto">
                  <button className="w-full py-4 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shadow-lg active:scale-95 flex justify-center items-center gap-2">
                    Login as Patient <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Features Bottom Row */}
          <div className="mt-24 grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto border-t border-white/5 pt-16">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-8 h-8 text-teal-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Military-Grade Security</h4>
              <p className="text-slate-500 text-sm">HIPAA-compliant data encryption guarantees your biological insights stay private.</p>
            </div>
            <div className="flex flex-col items-center">
              <Activity className="w-8 h-8 text-cyan-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">AI Diagnostics</h4>
              <p className="text-slate-500 text-sm">Trained algorithms instantly detect anomalies in lung audio data.</p>
            </div>
            <div className="flex flex-col items-center">
              <Wifi className="w-8 h-8 text-green-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">IoT Integration</h4>
              <p className="text-slate-500 text-sm">Direct, seamless wireless connection from your RespiScope IoT stethoscope.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0b2b22] py-8 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} RespiScope Systems. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;