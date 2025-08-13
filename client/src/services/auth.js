// src/services/auth.js
import axios from 'axios';

export const saveToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('user_role');
};
export const saveUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const getUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};
export const getUserId = () => {
  const user = getUser();
  return user ? user.id || user._id || null : null;
};

export const saveUserRole = (role) => localStorage.setItem('user_role', role);
export const getUserRole = () => localStorage.getItem('user_role');

// helper: fetch /api/auth/me (requires token present)
export const fetchAndSaveCurrentUser = async (baseUrl = process.env.REACT_APP_USER_API || 'http://localhost:8082') => {
  try {
    const token = getToken();
    if (!token) return null;
    const res = await axios.get(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    saveUser(res.data);
    return res.data;
  } catch (e) {
    console.warn('fetchAndSaveCurrentUser failed', e);
    return null;
  }
};


export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};