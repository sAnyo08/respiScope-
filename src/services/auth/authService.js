// src/services/authService.js
import api from '../api/api';

// Doctor
export const registerDoctor = (payload) => api.post('/auth/doctor/register', payload).then(r => r.data);
export const loginDoctor = async ({ phone, password }) => {
  const res = await api.post('/auth/doctor/login', { phone, password });
  const { accessToken, refreshToken, doctor } = res.data || {};
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken); // fallback if backend returns it
  localStorage.setItem('role', 'doctor');
  return { doctor };
};
export const refreshDoctor = () => api.post('/auth/doctor/refresh').then(r => r.data);
export const logoutDoctor = () => api.post('/auth/doctor/logout').then(() => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('role');
});

// Patient
export const registerPatient = (payload) => api.post('/auth/patient/register', payload).then(r => r.data);
export const loginPatient = async ({ phone, password }) => {
  const res = await api.post('/auth/patient/login', { phone, password });
  const { accessToken, refreshToken, patient } = res.data || {};
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('role', 'patient');
  return { patient };
};
export const refreshPatient = () => api.post('/auth/patient/refresh').then(r => r.data);
export const logoutPatient = () => api.post('/auth/patient/logout').then(() => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('role');
});

// Profiles
export const fetchDoctorProfile = () => api.get('/auth/doctor/me').then(r => r.data);
export const fetchPatientProfile = () => api.get('/auth/patient/me').then(r => r.data);

export default {
  registerDoctor, loginDoctor, refreshDoctor, logoutDoctor, fetchDoctorProfile,
  registerPatient, loginPatient, refreshPatient, logoutPatient, fetchPatientProfile
};
