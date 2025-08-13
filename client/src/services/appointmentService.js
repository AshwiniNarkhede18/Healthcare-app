// // src/services/appointmentService.js
// import axios from 'axios';
// import { getToken } from './auth';

// const API_BASE = process.env.REACT_APP_APPOINTMENT_API || 'http://localhost:8082/api'; // adjust env var if needed

// const authHeader = () => ({
//   headers: {
//     Authorization: `Bearer ${getToken()}`
//   }
// });

// // Appointment endpoints
// export const bookAppointment = (appointmentData) =>
//   axios.post(`${API_BASE}/appointments`, appointmentData, authHeader()).then(r => r.data);

// export const getUserAppointments = (userId) =>
//   axios.get(`${API_BASE}/appointments/user/${userId}`, authHeader()).then(r => r.data);

// export const getDoctorAppointments = (doctorId) =>
//   axios.get(`${API_BASE}/appointments/doctor/${doctorId}`, authHeader()).then(r => r.data);

// // Cancel (controller uses PUT /{id}/cancel)
// export const cancelAppointment = (appointmentId) =>
//   axios.put(`${API_BASE}/appointments/${appointmentId}/cancel`, null, authHeader()).then(r => r.data);

// // Mark completed (PATCH /{appointmentId}/complete?doctorId=)
// export const markAppointmentCompleted = (appointmentId, doctorId) =>
//   axios.patch(`${API_BASE}/appointments/${appointmentId}/complete?doctorId=${doctorId}`, null, authHeader()).then(r => r.data);

// // Consultation link
// export const getConsultationLink = (appointmentId) =>
//   axios.get(`${API_BASE}/appointments/${appointmentId}/consultation-link`, authHeader()).then(r => r.data);

// // History
// export const getUserAppointmentHistory = (userId) =>
//   axios.get(`${API_BASE}/appointments/history/user/${userId}`, authHeader()).then(r => r.data);

// export const getDoctorAppointmentHistory = (doctorId) =>
//   axios.get(`${API_BASE}/appointments/history/doctor/${doctorId}`, authHeader()).then(r => r.data);

// // Time slot endpoints
// export const getDoctorTimeSlots = (doctorId) =>
//   axios.get(`${API_BASE}/timeslots/doctor/${doctorId}`, authHeader()).then(r => r.data);

// export const addDoctorTimeSlot = (slotData) =>
//   axios.post(`${API_BASE}/timeslots`, slotData, authHeader()).then(r => r.data);

// // NOTE: backend currently doesn't expose DELETE /timeslots/{id} — if you add it, uncomment this
// export const deleteDoctorTimeSlot = (slotId) =>
//   axios.delete(`${API_BASE}/timeslots/${slotId}`, authHeader()).then(r => r.data);

// src/services/appointmentService.js
import axios from "axios";
import { getToken } from "./auth";

const API_BASE =
  process.env.REACT_APP_APPOINTMENT_API || "http://localhost:8082/api"; // adjust env var if needed

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// -------------------- Appointment endpoints --------------------

// Book appointment
export const bookAppointment = (appointmentData) =>
  axios
    .post(`${API_BASE}/appointments`, appointmentData, authHeader())
    .then((r) => r.data);

// Get appointments by user
export const getUserAppointments = (userId) =>
  axios
    .get(`${API_BASE}/appointments/user/${userId}`, authHeader())
    .then((r) => r.data);

// Get appointments by doctor
export const getDoctorAppointments = (doctorId) =>
  axios
    .get(`${API_BASE}/appointments/doctor/${doctorId}`, authHeader())
    .then((r) => r.data);

// Cancel appointment (controller uses PUT /{id}/cancel)
export const cancelAppointment = (appointmentId) =>
  axios
    .put(`${API_BASE}/appointments/${appointmentId}/cancel`, null, authHeader())
    .then((r) => r.data);

// Mark appointment completed (PATCH /{appointmentId}/complete?doctorId=)
export const markAppointmentCompleted = (appointmentId, doctorId) =>
  axios
    .patch(
      `${API_BASE}/appointments/${appointmentId}/complete?doctorId=${doctorId}`,
      null,
      authHeader()
    )
    .then((r) => r.data);

// Get consultation link
export const getConsultationLink = (appointmentId) =>
  axios
    .get(
      `${API_BASE}/appointments/${appointmentId}/consultation-link`,
      authHeader()
    )
    .then((r) => r.data);

// User appointment history
export const getUserAppointmentHistory = (userId) =>
  axios
    .get(`${API_BASE}/appointments/history/user/${userId}`, authHeader())
    .then((r) => r.data);

// Doctor appointment history
export const getDoctorAppointmentHistory = (doctorId) =>
  axios
    .get(`${API_BASE}/appointments/history/doctor/${doctorId}`, authHeader())
    .then((r) => r.data);

// -------------------- Time slot endpoints --------------------

// Get time slots for a doctor
export const getDoctorTimeSlots = (doctorId) =>
  axios
    .get(`${API_BASE}/timeslots/doctor/${doctorId}`, authHeader())
    .then((r) => r.data);

// Add new time slot
export const addDoctorTimeSlot = (slotData) =>
  axios
    .post(`${API_BASE}/timeslots`, slotData, authHeader())
    .then((r) => r.data);

// Update existing time slot ✅ NEW
export const updateDoctorTimeSlot = (slotId, slotData) =>
  axios
    .put(`${API_BASE}/timeslots/${slotId}`, slotData, authHeader())
    .then((r) => r.data);

// Delete time slot
export const deleteDoctorTimeSlot = (slotId) =>
  axios
    .delete(`${API_BASE}/timeslots/${slotId}`, authHeader())
    .then((r) => r.data);

// export const rescheduleAppointment = (appointmentId, newDateTime) =>
//   axios
//     .put(
//       `${API_BASE}/appointments/${appointmentId}/reschedule`,
//       { newDateTime },
//       authHeader()
//     )
//     .then((r) => r.data);

export const updateAppointmentTimeSlot = (appointmentId, slotId) =>
  axios
    .put(
      `${API_BASE}/appointments/${appointmentId}/reschedule/${slotId}`,
      null,
      authHeader()
    )
    .then((r) => r.data);
