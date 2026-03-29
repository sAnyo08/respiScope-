import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const AdminAuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Assume login updates AuthContext state

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    // Static Authentication
    if (email === 'admin@respiscope.com' && password === 'admin123') {
      // Create a mock admin user object or token
      const mockAdminUser = { id: 'admin1', name: 'System Admin', role: 'admin' };
      login(mockAdminUser, 'admin_mock_token');
      navigate('/admin');
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#041d14] via-[#0b2b22] to-[#10141a] transition-colors relative overflow-hidden">
      <Helmet>
        <title>Admin Login | RespiScope</title>
      </Helmet>
      
      {/* Background Decorative Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="backdrop-blur-xl bg-white/5 dark:bg-black/20 border border-white/10 dark:border-white/5 shadow-2xl rounded-3xl p-8 relative overflow-hidden">
          {/* subtle header glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 via-green-400 to-teal-400" />
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-300 font-manrope">
              System Admin
            </h2>
            <p className="mt-2 text-sm text-gray-300">Authorized Personnel Only</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-white placeholder-gray-500 transition-all outline-none"
                placeholder="admin@respiscope.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-white placeholder-gray-500 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-gray-900 bg-gradient-to-r from-teal-400 to-green-400 hover:from-teal-300 hover:to-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#10141a] focus:ring-teal-400 transition-all transform active:scale-[0.98]"
            >
              Sign In to Dashboard
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <a href="/" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
              &larr; Return to Public Portal
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAuthPage;
