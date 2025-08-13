// src/components/doctor/appointments/DoctorAppointmentHistory.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../services/auth";

const DoctorAppointmentHistory = () => {
  const [history, setHistory] = useState([]);
  const doctorId = localStorage.getItem("doctorId"); // Save in login

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8082/api/appointments/history/doctor/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` }
        }
      );
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching appointment history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Appointment History</h2>
      {history.length > 0 ? (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Patient</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>{appt.patientName}</td>
                <td>{appt.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-3">No appointment history available.</p>
      )}
    </div>
  );
};

export default DoctorAppointmentHistory;
