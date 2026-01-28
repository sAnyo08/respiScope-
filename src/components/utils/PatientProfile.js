import React, { useState, useEffect ,useContext} from 'react';
import { User, Phone, MapPin, Calendar, Activity, Ruler, Weight, Shield } from 'lucide-react';
import {AuthContext} from "../../context/authContext";

const PatientProfile = () => {
  
  const { user, loading } = useContext(AuthContext);
  // 🔥 Guard 1: still loading
  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  // 🔥 Guard 2: no user (token expired / logged out)
  if (!user) {
    return <div className="p-6">No profile data found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2">
      <div className="max-w-auto mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user
              .name}</h1>
              <p className="text-blue-100 text-lg capitalize flex items-center">
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
              <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Personal Information
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="text-gray-800 font-medium">{user
                      .phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Age</p>
                      <p className="text-gray-800 font-medium">{user
                      .age} years</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="text-gray-800 font-medium">{user
                      .gender}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="text-gray-800 font-medium">{user
                      .address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Health Information
              </h2>
              
              <div className="space-y-4">
                <div className="bg-green-50 rounded-xl p-4 hover:bg-green-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Ruler className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-green-700">Height</p>
                      <p className="text-green-800 font-medium">{user
                      .height} ft</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-4 hover:bg-orange-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Weight className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-orange-700">Weight</p>
                      <p className="text-orange-800 font-medium">{user
                      .weight} kg</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 hover:bg-purple-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-purple-700">Prior Disease</p>
                      <p className="text-purple-800 font-medium">{user
                      .priorDisease || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Stats Card */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-3">Health Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{user
                    .age}</p>
                    <p className="text-sm text-blue-100">Years Old</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{user
                    .weight}</p>
                    <p className="text-sm text-blue-100">Weight (kg)</p>
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