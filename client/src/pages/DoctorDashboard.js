// // src/pages/DoctorDashboard.js
// import React from 'react';

// function DoctorDashboard() {
//   return (
//     <div className="container mt-5">
//       <h2>Doctor Dashboard</h2>
//       <p>Welcome, Doctor!</p>
//     </div>
//   );
// }

// export default DoctorDashboard;

import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
// Import Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserMd,
  faClinicMedical,
  faHeadset,
  faVideo,
  faHeartbeat,
  faFileMedical,
} from "@fortawesome/free-solid-svg-icons";

function DoctorDashboard() {
  const navigate = useNavigate(); // Hook to navigate to other pages

  // Handler for button click to navigate to login page
  const handleBookAppointment = () => {
    navigate("/doctor-appointments"); // Navigating to the login page
  };

  const handleChatbot = () => {
    navigate("/Profile"); // Navigating to the login page
  };

  return (
    <div className="home-container">
      <div className="home-overlay"></div> {/* Overlay for readability */}
      <div
        className="home-content"
        style={{ textAlign: "left", marginLeft: "-550px" }}
      >
        <div style={{ textAlign: "center" }}>
          <h1>Welcome Doctor</h1>
        </div>

        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleBookAppointment} // Button click will trigger navigation
        >
          Show Appointments
        </button>
        <button
          className="chatUs"
          style={{
            position: "absolute",
            marginTop: "20px",
            padding: "10px 30px",
            fontSize: "16px",
            marginLeft: "60px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleChatbot} // Button click will trigger navigation
        >
          <i className="fas fa-comments">Profile</i>
        </button>
      </div>
      {/* Additional Sections */}
      <div
        className="features-section"
        style={{ marginTop: "50px", textAlign: "center" }}
      >
        <h3 style={{ fontSize: "24px", marginBottom: "20px" }}>
          Why Choose Us?
        </h3>
        <div className="features">
          <div className="feature-item" style={{ marginBottom: "20px" }}>
            <FontAwesomeIcon
              icon={faUserMd}
              style={{ color: "#007BFF", marginLeft: "45%", fontSize: "30px" }}
            />
            <h4>Expert Doctors</h4>
            <p>
              Our team consists of highly skilled professionals dedicated to
              providing the best care possible.
            </p>
          </div>
          <div className="feature-item" style={{ marginBottom: "20px" }}>
            <FontAwesomeIcon
              icon={faClinicMedical}
              style={{ color: "#28A745", marginLeft: "45%", fontSize: "30px" }}
            />
            <h4>Advanced Facilities</h4>
            <p>
              We use the latest technology and state-of-the-art equipment for
              accurate diagnosis and treatment.
            </p>
          </div>
          <div className="feature-item">
            <FontAwesomeIcon
              icon={faHeadset}
              style={{ color: "#FFC107", marginLeft: "45%", fontSize: "30px" }}
            />
            <h4>24/7 Support</h4>
            <p>
              Access our services anytime with our round-the-clock support team
              ready to assist you.
            </p>
          </div>
        </div>
      </div>
      {/* New Section: Key Features */}
      <div
        className="key-features-section"
        style={{ marginTop: "50px", textAlign: "center", padding: "20px" }}
      >
        <h3 style={{ fontSize: "24px", marginBottom: "20px" }}>Key Features</h3>
        <div className="key-features">
          <div className="key-feature-item" style={{ marginBottom: "20px" }}>
            <FontAwesomeIcon
              icon={faVideo}
              style={{ color: "#17A2B8", marginLeft: "45%", fontSize: "30px" }}
            />
            <h4>Teleconsultation</h4>
            <p>
              Connect with your doctor from the comfort of your home through
              video or voice calls.
            </p>
          </div>
          <div className="key-feature-item" style={{ marginBottom: "20px" }}>
            <FontAwesomeIcon
              icon={faHeartbeat}
              style={{ color: "#DC3545", marginLeft: "45%", fontSize: "30px" }}
            />
            <h4>Health Monitoring</h4>
            <p>
              Track your health metrics and receive personalized recommendations
              for a healthier lifestyle.
            </p>
          </div>
          <div className="key-feature-item">
            <FontAwesomeIcon
              icon={faFileMedical}
              style={{ color: "#6C757D", marginLeft: "45%", fontSize: "30px" }}
            />
            <h4>Secure Digital Records</h4>
            <p>
              Access your medical history, prescriptions, and reports anytime on
              our secure platform.
            </p>
          </div>
        </div>
      </div>
      <footer className="footer1" style={{ marginTop: "50px" }}>
        <div
          className="footer1-container"
          style={{
            backgroundColor: "#000",
            color: "#fff",
            width: "80%",
            padding: "10px 20px",
            textAlign: "center",
          }}
        >
          <p>&copy; 2024 DoctorApp. All rights reserved.</p>
          <p>
            <a
              href="/terms"
              style={{ color: "#007BFF", textDecoration: "none" }}
            >
              Terms of Service
            </a>{" "}
            |{" "}
            <a
              href="/privacy"
              style={{ color: "#007BFF", textDecoration: "none" }}
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default DoctorDashboard;
