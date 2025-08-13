import axios from 'axios';
import { getToken } from './auth';

const BASE = 'http://localhost:8082/api/video';

const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export const createOrGetVideoSession = (appointmentId) => 
  axios.post(`${BASE}/${appointmentId}`, {}, authHeader()).then(res => res.data);

export const getVideoSession = (appointmentId) => 
  axios.get(`${BASE}/${appointmentId}`, authHeader()).then(res => res.data);

export const endVideoSession = (appointmentId) => 
  axios.put(`${BASE}/${appointmentId}/end`, {}, authHeader()).then(res => res.data);
