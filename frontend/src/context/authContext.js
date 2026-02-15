// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import { fetchDoctorProfile } from '../services/api/doctorService';
import { fetchPatientProfile } from '../services/api/patientService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token || !role) { setLoading(false); return; }
      try {
        if (role === 'doctor') {
          const res = await fetchDoctorProfile();
          console.log("RAW PROFILE:", res);
          setUser(res.data ?? res.user ?? res); // adapt to your backend response shape
        } else {
          const res = await fetchPatientProfile();
          console.log("RAW PROFILE:", res);
          setUser(res.data ?? res.user ?? res);
        }
      } catch (e) {
        console.error('Profile load failed', e);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [role]);

  const login = (userObj, role) => {
    setUser(userObj);
    setRole(role);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
