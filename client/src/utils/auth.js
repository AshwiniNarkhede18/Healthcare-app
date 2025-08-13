// src/utils/auth.js

import { jwtDecode } from 'jwt-decode';
import { getToken } from '../services/auth';

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.role || decoded.roles?.[0]; // Flexible to backend structure
  } catch (e) {
    return null;
  }
};
