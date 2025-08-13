// src/components/user/appointmens/MyAppointmentHistory.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../services/auth";

const MyAppointmentHistory = () => {
  const [history, setHistory] = useState([]);
  const userId = localStorage.getItem("userId"); // Save in login

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8082/api/appointments/history/user/${userId}`,
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
      <h2>My Appointment History</h2>
      {history.length > 0 ? (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Doctor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>{appt.doctorName}</td>
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

export default MyAppointmentHistory;
