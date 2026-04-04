import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { motion } from 'framer-motion';

const API_URL = "http://localhost:5000/api/auth";

const PatientAuthPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    role: "patient", // Default mapping for API
    phone: "",
    password: "",
    age: "",
    gender: "",
    address: "",
    height: "",
    weight: "",
    priorDisease: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = isLogin ? `${API_URL}/login/patient` : `${API_URL}/register/patient`;
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
        const userRole = data.role || "patient";
        localStorage.setItem("role", userRole);
        login(data.user, userRole);
        navigate("/patient-dashboard");
      } else {
        setMessage("Registration successful! You can now login.");
        setIsLogin(true);
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a192f] via-[#0f2c29] to-[#041d14]">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Auth Form (Left Side for Patient to vary layout) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl relative"
        >
          <div className="mb-8">
             <h2 className="text-3xl font-bold text-white mb-2 font-manrope">
              {isLogin ? "Patient Portal" : "Join RespiScope"}
            </h2>
            <p className="text-teal-100/60">
              {isLogin ? "Sign in to access your insights" : "Register for advanced health tracking"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 overflow-hidden"
              >
                {/* Full Name */}
                <div className="relative">
                  <input
                    name="name" type="text" placeholder="Full Name" required
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-teal-400 focus:bg-white/10 transition-colors"
                  />
                  <User className="absolute left-3 top-3.5 text-teal-400/70" size={20} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Age */}
                  <div className="relative">
                    <input
                      name="age" type="number" placeholder="Age"
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-teal-400 focus:bg-white/10 transition-colors"
                    />
                  </div>
                  {/* Gender */}
                  <div className="relative">
                    <input
                      name="gender" type="text" placeholder="Gender"
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-teal-400 focus:bg-white/10 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Height */}
                  <div className="relative">
                    <input
                      name="height" type="number" placeholder="Height (cm)"
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-teal-400 focus:bg-white/10 transition-colors"
                    />
                  </div>
                  {/* Weight */}
                  <div className="relative">
                    <input
                      name="weight" type="number" placeholder="Weight (kg)"
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-teal-400 focus:bg-white/10 transition-colors"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="relative">
                  <input
                    name="address" type="text" placeholder="City & Region"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-teal-400 focus:bg-white/10 transition-colors"
                  />
                </div>

                 {/* Prior Disease */}
                 <div className="relative">
                  <input
                    name="priorDisease" type="text" placeholder="Prior Diseases (Optional)"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-teal-400 focus:bg-white/10 transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {/* Phone (Acts as username/email here based on backend) */}
            <div className="relative mt-4">
              <input
                name="phone" type="text" placeholder="Phone Number" required
                onChange={handleChange}
                className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-colors"
              />
              <Mail className="absolute left-3 top-3.5 text-emerald-400/70" size={20} />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" required
                onChange={handleChange}
                className="w-full px-4 py-3 pl-11 pr-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-colors"
              />
              <Lock className="absolute left-3 top-3.5 text-emerald-400/70" size={20} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-emerald-400/70 hover:text-emerald-300 transition-colors focus:outline-none"
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
              className="w-full py-4 mt-6 rounded-xl font-bold text-gray-900 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] active:scale-95"
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
              className="text-emerald-400/80 hover:text-emerald-300 transition-colors text-sm font-medium"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Creative Facts / Motivation */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-end p-16 z-10 text-right">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-white/10 ml-auto">
            <svg className="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-teal-400 mb-6 font-manrope">
            You Are In Control
          </h1>
          <p className="text-lg text-teal-100/80 mb-8 font-inter leading-relaxed">
            Your lungs inhale over 11,000 liters of air daily, keeping your respiratory system in harmony.
            With RespiScope, track your heart and lung health with precision, turning vital signs into a life-saving melody.
          </p>
          <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-2xl">
            <p className="text-white font-semibold mb-2">"RespiScope transformed how I view my health patterns, alerting my doctor before I even felt sick."</p>
            <p className="text-emerald-400 text-sm">— Mark G., Recovered Patient</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientAuthPage;