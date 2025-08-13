// src/components/rating/RatingList.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RatingList = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all completed appointments and ratings
        const apptRes = await fetch("/api/appointments"); // ✅ replace with your endpoint
        const appts = await apptRes.json();

        const ratingRes = await fetch("/api/ratings"); // ✅ replace with your endpoint
        const ratingsData = await ratingRes.json();

        setAppointments(appts);
        setRatings(ratingsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGiveFeedback = (doctorId, appointmentId) => {
    navigate("/user/rating", {
      state: { doctorId, appointmentId },
    });
  };

  return (
    <div className="rating-list-container">
      <h2>Ratings</h2>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          {/* Ratings table */}
          <table className="rating-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Doctor</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.userName}</td>
                  <td>{r.doctorName}</td>
                  <td>{r.rating}/5</td>
                  <td>{r.review}</td>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Appointments that need feedback */}
          <h3>Pending Feedback</h3>
          <table className="appt-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments
                .filter((a) => a.status === "COMPLETED" && !a.feedbackGiven)
                .map((appt) => (
                  <tr key={appt.id}>
                    <td>{appt.doctorName}</td>
                    <td>{appt.date}</td>
                    <td>{appt.status}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() =>
                          handleGiveFeedback(appt.doctorId, appt.id)
                        }
                      >
                        Give Feedback
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default RatingList;
