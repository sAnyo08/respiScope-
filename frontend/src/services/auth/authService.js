import api from '../api/api';

// Shared
const login = async (role, { phone, password }) => {
  const res = await api.post(`/auth/login/${role}`, { phone, password });
  const { accessToken, user, role: resRole } = res.data || {};
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('role', resRole || role);
  }
  return res.data;
};

const register = async (role, payload) => {
  const res = await api.post(`/auth/register/${role}`, payload);
  return res.data;
};

const logout = async (role) => {
  try {
    await api.post(`/auth/logout/${role}`);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
  }
};

const refresh = async (role) => {
  const res = await api.post(`/auth/${role}/refresh`);
  if (res.data?.accessToken) {
    localStorage.setItem('accessToken', res.data.accessToken);
  }
  return res.data;
};

// Exports matching expected names if needed, or simplified ones
export const loginDoctor = (credentials) => login('doctor', credentials);
export const loginPatient = (credentials) => login('patient', credentials);
export const registerDoctor = (payload) => register('doctor', payload);
export const registerPatient = (payload) => register('patient', payload);

export default {
  login,
  register,
  logout,
  refresh,
  loginDoctor,
  loginPatient,
  registerDoctor,
  registerPatient
};
