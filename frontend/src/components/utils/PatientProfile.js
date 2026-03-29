import React, { useContext } from 'react';
import { User, Phone, MapPin, Calendar, Activity, Ruler, Weight, Shield } from 'lucide-react';
import { AuthContext } from "../../context/authContext";

const PatientProfile = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="p-6 text-teal-400">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-6 text-gray-400">No profile data found</div>;
  }

  return (
    <div className="min-h-screen bg-transparent p-2">
      <div className="max-w-auto mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,128,128,0.1)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900/40 to-[#0b2b22]/50 border-b border-white/10 px-8 py-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-teal-500/20 border border-teal-500/30 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              <User className="w-12 h-12 text-teal-400 drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-md">
                {user.name}
              </h1>
              <p className="text-teal-400 text-lg capitalize flex items-center mt-1">
                <Activity className="w-4 h-4 mr-2" />
                Patient Profile
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-100 border-b border-teal-500/20 pb-2 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-400" />
                Personal Information
              </h2>
              
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-teal-400" />
                    <div>
                      <p className="text-sm text-gray-400">Phone Number</p>
                      <p className="text-gray-100 font-medium">{user.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-sm text-gray-400">Age</p>
                      <p className="text-gray-100 font-medium">{user.age} years</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Gender</p>
                      <p className="text-gray-100 font-medium capitalize">{user.gender}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-sm text-gray-400">Address</p>
                      <p className="text-gray-100 font-medium">{user.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-100 border-b border-emerald-500/20 pb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Health Information
              </h2>
              
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 hover:bg-emerald-500/20 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Ruler className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-sm text-emerald-300/80">Height</p>
                      <p className="text-emerald-100 font-medium">{user.height} ft</p>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 hover:bg-cyan-500/20 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Weight className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-sm text-cyan-300/80">Weight</p>
                      <p className="text-cyan-100 font-medium">{user.weight} kg</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 hover:bg-purple-500/20 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-purple-300/80">Prior Disease</p>
                      <p className="text-purple-100 font-medium capitalize">{user.priorDisease || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Stats Card */}
              <div className="bg-gradient-to-r from-teal-600/30 to-emerald-600/30 border border-teal-500/40 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/20 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-teal-100">
                  <Shield className="w-5 h-5" /> Health Score Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="text-center bg-black/20 rounded-lg py-3 border border-white/5">
                    <p className="text-3xl font-bold text-white drop-shadow-md">{user.age}</p>
                    <p className="text-xs text-teal-200 mt-1 uppercase tracking-wider font-semibold">Years</p>
                  </div>
                  <div className="text-center bg-black/20 rounded-lg py-3 border border-white/5">
                    <p className="text-3xl font-bold text-white drop-shadow-md">{user.weight}</p>
                    <p className="text-xs text-teal-200 mt-1 uppercase tracking-wider font-semibold">Weight (kg)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;