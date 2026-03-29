import React, { useContext } from 'react';
import { Stethoscope, GraduationCap, Building2, Phone, MapPin, Activity } from 'lucide-react';
import { AuthContext } from "../../context/authContext";

const DoctorProfile = () => {
  const { user, loading } = useContext(AuthContext); 
  
  if (loading) {
    return <div className="p-6 text-teal-400">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-6 text-gray-400">No profile data found</div>;
  }

  return (
    <div className="min-h-screen bg-transparent p-2">
      <div className="max-w-auto mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(4,29,20,0.5)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900/40 to-[#0b2b22]/50 border-b border-white/10 px-8 py-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-teal-500/20 border border-teal-500/30 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              <Stethoscope className="w-12 h-12 text-teal-400 drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-md">
                {user.name}
              </h1>
              <p className="text-teal-400 text-lg flex items-center mt-1">
                <GraduationCap className="w-4 h-4 mr-2" />
                Medical Professional
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Professional Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-100 border-b border-teal-500/20 pb-2 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-400" />
                Professional Information
              </h2>
              
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 hover:bg-emerald-500/20 transition-colors">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-sm text-emerald-300/80">Degree</p>
                      <p className="text-emerald-100 font-medium">{user.degree}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 hover:bg-blue-500/20 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-blue-300/80">Experience</p>
                      <p className="text-blue-100 font-medium">{user.experience} years</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 hover:bg-purple-500/20 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-purple-300/80">Hospital</p>
                      <p className="text-purple-100 font-medium">{user.hospital}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-100 border-b border-cyan-500/20 pb-2 flex items-center gap-2">
                <Phone className="w-5 h-5 text-cyan-400" />
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Phone Number</p>
                      <p className="text-gray-100 font-medium">{user.phone}</p>
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

              {/* Stats Card */}
              <div className="bg-gradient-to-r from-teal-600/30 to-emerald-600/30 border border-teal-500/40 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/20 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-teal-100">
                  <Activity className="w-5 h-5" /> Professional Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="text-center bg-black/20 rounded-lg py-3 border border-white/5">
                    <p className="text-3xl font-bold text-white drop-shadow-md">{user.experience}</p>
                    <p className="text-xs text-teal-200 mt-1 uppercase tracking-wider font-semibold">Years Exp.</p>
                  </div>
                  <div className="text-center bg-black/20 rounded-lg py-3 border border-white/5">
                    <p className="text-xl font-bold text-white drop-shadow-md mt-1">{user.degree}</p>
                    <p className="text-xs text-teal-200 mt-2 uppercase tracking-wider font-semibold">Qualification</p>
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

export default DoctorProfile;