import React, { useState, useEffect } from 'react';
import { Stethoscope, GraduationCap, Building2, Phone, MapPin, Activity, User } from 'lucide-react';

const DoctorProfile = () => {
  const [doctorData, setDoctorData] = useState({
    "name": "Dr. Adarsh Gupta",
    "degree" : "MBBS",
    "experience": "10",
    "address": "kandivali, Mumbai",
    "password": "DoctorAdarsh",
    "hospital": "Oberoi Hospital",
    "phone": "8369291692"
  });
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // const fetchDoctorProfile = async () => {
  //   try {
  //     setLoading(true);
  //     const token = localStorage.getItem('accessToken'); // Your token storage key
      
  //     const response = await fetch('/api/profile/doctor', {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch doctor profile');
  //     }

  //     const data = await response.json();
  //     setDoctorData(data.user);
  //     setError(null);
      
  //   } catch (err) {
  //     setError(err.message);
  //     console.error('Error fetching doctor profile:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchDoctorProfile();
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
  //       <div className="text-red-600 text-center bg-white p-8 rounded-lg shadow-lg">
  //         <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
  //         <p>{error}</p>
  //         <button 
  //           // onClick={fetchDoctorProfile}
  //           className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
  //         >
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!doctorData) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
  //       <div className="text-gray-600 text-center bg-white p-8 rounded-lg shadow-lg">
  //         <h2 className="text-2xl font-bold mb-2">No Profile Data Found</h2>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-2">
      <div className="max-w-auto mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{doctorData.name}</h1>
              <p className="text-emerald-100 text-lg flex items-center">
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
              <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Professional Information
              </h2>
              
              <div className="space-y-4">
                <div className="bg-emerald-50 rounded-xl p-4 hover:bg-emerald-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-emerald-700">Degree</p>
                      <p className="text-emerald-800 font-medium">{doctorData.degree}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 hover:bg-blue-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-700">Experience</p>
                      <p className="text-blue-800 font-medium">{doctorData.experience} years</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 hover:bg-purple-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-purple-700">Hospital</p>
                      <p className="text-purple-800 font-medium">{doctorData.hospital}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="text-gray-800 font-medium">{doctorData.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-4 hover:bg-orange-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-orange-700">Address</p>
                      <p className="text-orange-800 font-medium">{doctorData.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-3">Professional Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{doctorData.experience}</p>
                    <p className="text-sm text-emerald-100">Years Experience</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{doctorData.degree}</p>
                    <p className="text-sm text-emerald-100">Qualification</p>
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