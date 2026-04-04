import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { Phone, Lock, Eye, EyeOff, User, LetterText, Calendar, Hospital, Map, PenIcon } from 'lucide-react';
import { motion } from "framer-motion";

const API_URL = "http://localhost:5000/api/auth";

export default function DoctorAuthPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    role: "doctor", // Defaulting to Doctor
    phone: "",
    password: "",
    degree: "",
    experience: "",
    address: "",
    hospital: "",
  });
  const [message, setMessage] = useState("");
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = isLogin ? `${API_URL}/login/doctor` : `${API_URL}/register/doctor`;
      const body = isLogin
        ? { phone: formData.phone, password: formData.password }
        : formData;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      if (isLogin) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        const userRole = data.role || "doctor";
        localStorage.setItem("role", userRole);
        login(data.user, userRole);
        navigate("/doctor-dashboard");
      } else {
        setMessage("Registration successful! You can now login.");
        setIsLogin(true);
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-gradient-to-br from-[#041d14] via-[#0b2b22] to-[#10141a]">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Left Side: Creative Facts / Motivation */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-start p-16 z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-white/10">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400 mb-6 font-manrope">
            Empowering Your Practice
          </h1>
          <p className="text-lg text-teal-100/80 mb-8 font-inter leading-relaxed">
            The heart beats around 100,000 times a day, and the lungs inhale over 11,000 liters of air daily.
            With RespiScope, monitor these vital rhythms effortlessly. Transform everyday health checks into a symphony of precision and care.
          </p>
          <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-2xl">
            <p className="text-white font-semibold mb-2">"RespiScope revolutionized how I listen to the body's whispers – precise, smart, and life-saving."</p>
            <p className="text-teal-400 text-sm">— Dr. Elena Vasquez, Pulmonologist</p>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl relative"
        >
          <h2 className="text-3xl font-bold text-white mb-2 font-manrope">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-teal-100/60 mb-8">
            {isLogin ? "Sign in to access your dashboard" : "Register to start using RespiScope"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                {/* Full Name */}
                <div className="relative">
                  <input
                    name="name" type="text" placeholder="Full Name" required
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-green-400 focus:bg-white/10 transition-colors"
                  />
                  <LetterText className="absolute left-3 top-3.5 text-green-400/70" size={20} />
                </div>

                <div className="flex gap-4">
                  {/* Degree */}
                  <div className="relative w-1/2">
                    <input
                      name="degree" type="text" placeholder="Degree (e.g. MD)"
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-green-400 focus:bg-white/10 transition-colors"
                    />
                    <PenIcon className="absolute left-3 top-3.5 text-green-400/70" size={20} />
                  </div>
                  {/* Experience */}
                  <div className="relative w-1/2">
                    <input
                      name="experience" type="text" placeholder="Experience (yrs)"
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-green-400 focus:bg-white/10 transition-colors"
                    />
                    <Calendar className="absolute left-3 top-3.5 text-green-400/70" size={20} />
                  </div>
                </div>

                <div className="flex gap-4">
                  {/* Hospital */}
                  <div className="relative w-1/2">
                    <input
                      name="hospital" type="text" placeholder="Hospital/Clinic"
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-green-400 focus:bg-white/10 transition-colors"
                    />
                    <Hospital className="absolute left-3 top-3.5 text-green-400/70" size={20} />
                  </div>
                  {/* Address */}
                  <div className="relative w-1/2">
                    <input
                      name="address" type="text" placeholder="City, State"
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-green-400 focus:bg-white/10 transition-colors"
                    />
                    <Map className="absolute left-3 top-3.5 text-green-400/70" size={20} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phone */}
            <div className="relative">
              <input
                name="phone" type="text" placeholder="Work Phone" required
                onChange={handleChange}
                className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-teal-400 focus:bg-white/10 transition-colors"
              />
              <Phone className="absolute left-3 top-3.5 text-teal-400/70" size={20} />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" required
                onChange={handleChange}
                className="w-full px-4 py-3 pl-11 pr-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-teal-400 focus:bg-white/10 transition-colors"
              />
              <Lock className="absolute left-3 top-3.5 text-teal-400/70" size={20} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-teal-400/70 hover:text-teal-300 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {message && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 mt-6 rounded-xl font-bold text-gray-900 bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-300 hover:to-teal-300 transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] active:scale-95"
            >
              {isLogin ? "Sign In" : "Register"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
              className="text-teal-400/80 hover:text-teal-300 transition-colors text-sm font-medium"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
