import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/api";
import { getToken, getUser } from "../../services/auth"; // ✅ Added getUser
import BookAppointmentModal from "./appointments/BookAppointmentModal";

const DoctorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/doctors/${id}/profile`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => {
        setDoctor(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch doctor details", err);
        alert("Unable to load doctor profile");
        navigate("/search-doctors");
      });
  }, [id, navigate]);

  if (!doctor) {
    return <div className="container mt-4">Loading...</div>;
  }
  console.log("Doctor object in profile:", doctor);

  const user = getUser();
  console.log("Logged-in user:", user);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Doctor Profile</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title">{doctor.fullName}</h4>
          <p>
            <strong>Email:</strong> {doctor.email}
          </p>
          <p>
            <strong>Phone:</strong> {doctor.phoneNumber}
          </p>
          <p>
            <strong>Specialization:</strong> {doctor.specialization}
          </p>
          <p>
            <strong>Experience:</strong> {doctor.experience} years
          </p>
          <p>
            <strong>Consultation Fee:</strong> {doctor.consultationFee}/- Rs.
          </p>
          <p>
            <strong>Area:</strong> {doctor.area}
          </p>

          <p>
            <strong>Description:</strong>{" "}
            {doctor.description || "No details available."}
          </p>

          {user?.role === "ROLE_USER" && (
            <>
              <button
                className="btn btn-success mt-3"
                onClick={() => setShowBooking(true)}
              >
                Book Appointment
              </button>

              <BookAppointmentModal
                show={showBooking}
                handleClose={() => setShowBooking(false)}
                doctor={doctor}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
