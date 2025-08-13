// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./pages/Navbar";
import UserDashboard from "./pages/UserDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import UserProfile from "./components/shared/UserProfile";
import DoctorList from "./components/user/DoctorList";
import DoctorSearch from "./components/user/DoctorSearch";
import DoctorProfilePage from "./components/user/DoctorProfilePage";
import MyAppointments from "./components/user/appointments/MyAppointments";
import DoctorAppointments from "./components/doctor/appointments/DoctorAppointments";
import TimeSlotManager from "./components/doctor/appointments/TimeSlotManager";
import MyAppointmentHistory from "./components/user/appointments/MyAppointmentHistory";
import DoctorAppointmentHistory from "./components/doctor/appointments/DoctorAppointmentHistory";
import DoctorPrescriptions from "./components/prescriptions/DoctorPrescriptions";
import UserPrescriptions from "./components/prescriptions/UserPrescriptions";
import PrescriptionUpload from "./components/prescriptions/PrescriptionUpload";
import Home from "./pages/Home";
import Chatbot from "./pages/Chatbot"; // Importing the Chatbot component
import About from "./pages/About"; // Importing the About page
import RatingPage from "./components/rating/RatingPage"; // Importing the Rating page
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/search-doctors" element={<DoctorSearch />} />
        <Route path="/doctors/:id" element={<DoctorProfilePage />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/manage-timeslots" element={<TimeSlotManager />} />
        <Route path="/doctor-appointments" element={<DoctorAppointments />} />
        <Route path="/about" element={<About />} />
        <Route path="/rate" element={<RatingPage />} />
        {/* User Appointment History */}
        <Route
          path="/my-appointments/history"
          element={<MyAppointmentHistory />}
        />

        {/* Doctor Appointment History */}
        <Route
          path="/doctor/appointments/history"
          element={<DoctorAppointmentHistory />}
        />
        <Route path="/upload-prescription" element={<PrescriptionUpload />} />
        <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
        <Route path="/user/prescriptions" element={<UserPrescriptions />} />
      </Routes>
    </Router>
  );
}

export default App;
