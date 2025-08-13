import axios from 'axios';
import { getToken } from './auth';
const BASE = 'http://localhost:8082/api';

const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export const uploadPrescription = (payload) =>
  axios.post(`${BASE}/prescriptions/submit`, payload, authHeader()).then(r => r.data);

export const getPrescriptionByAppointment = (appointmentId) =>
  axios.get(`${BASE}/prescriptions/${appointmentId}`, authHeader()).then(r => r.data);

export const downloadPrescription = (appointmentId) =>
  axios.get(`${BASE}/prescriptions/download/${appointmentId}`, { ...authHeader(), responseType: 'blob' });

export const getPrescriptionsByUser = (userId) =>
  axios.get(`${BASE}/prescriptions/user/${userId}`, authHeader()).then(r => r.data);

export const getPrescriptionsByDoctor = (doctorId) =>
  axios.get(`${BASE}/prescriptions/doctor/${doctorId}`, authHeader()).then(r => r.data);

export const prescriptionExists = (appointmentId) =>
  axios.get(`${BASE}/prescriptions/exists/${appointmentId}`, authHeader()).then(r => r.data);
