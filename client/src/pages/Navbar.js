// src/components/Navbar.js

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, removeToken } from "../services/auth";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStethoscope } from "@fortawesome/free-solid-svg-icons";
const Navbar = () => {
  const navigate = useNavigate();
  let role = null;

  // ✅ Safely get and decode the token
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role || decoded.roles?.[0]; // Support both single role or array
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  // ✅ Handle logout
  const logout = () => {
    removeToken();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">
        <FontAwesomeIcon icon={faStethoscope} className="navbar-logo-icon" />
        HealthCare
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          {/* ✅ Not logged in */}
          {!isLoggedIn() ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              {/* ✅ Logged in as USER */}
              {role === "ROLE_USER" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/user/dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/search-doctors">
                      Search Doctors
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/my-appointments">
                      My Appointments
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/About">
                      About Us
                    </Link>
                    {/* { <li className="nav-item">
                      <Link className="nav-link" to="/user/prescriptions">
                        Prescription
                      </Link> 
                     </li>}  */}
                  </li>
                </>
              )}

              {/* ✅ Logged in as DOCTOR */}
              {role === "ROLE_DOCTOR" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor/dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-appointments">
                      My Appointments
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/manage-timeslots">
                      Manage Time Slots
                    </Link>
                  </li>{" "}
                  {/* <li className="nav-item">
                    <Link className="nav-link" to="/upload-prescription">
                      Upload Prescription
                    </Link>
                  </li>{" "} */}
                  <li className="nav-item">
                    <Link className="nav-link" to="/About">
                      About Us
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/doctor/appointments/history"
                    >
                      Appointment History
                    </Link>
                  </li>
                </>
              )}

              {/* ✅ Logout for any logged-in user */}
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={logout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

// // Navbar.js
// import React from "react";
// import { Link } from "react-router-dom";
// import "./Navbar.css"; // Navbar styling
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faStethoscope,
//   faHome,
//   faInfoCircle,
//   faPhone,
//   faSignInAlt,
//   faUserPlus,
//   faUserTie,
// } from "@fortawesome/free-solid-svg-icons"; // Correct import for faUserTie

// function Navbar() {
//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <Link to="/" className="navbar-logo">
//           <FontAwesomeIcon icon={faStethoscope} className="navbar-logo-icon" />
//           DoctorApp
//         </Link>
//         <ul className="navbar-links">
//           <li>
//             <Link to="/">
//               <FontAwesomeIcon icon={faHome} className="navbar-icon" />
//               Home
//             </Link>
//           </li>
//           <li>
//             <Link to="/about">
//               <FontAwesomeIcon icon={faInfoCircle} className="navbar-icon" />
//               About
//             </Link>
//           </li>
//           <li>
//             <Link to="/contact">
//               <FontAwesomeIcon icon={faPhone} className="navbar-icon" />
//               Contact
//             </Link>
//           </li>
//           <li>
//             <Link to="/login">
//               <FontAwesomeIcon icon={faSignInAlt} className="navbar-icon" />
//               Login
//             </Link>
//           </li>
//           <li>
//             <Link to="/register">
//               <FontAwesomeIcon icon={faUserPlus} className="navbar-icon" />
//               Register
//             </Link>
//           </li>
//           <li>
//             <Link to="/adminLogin">
//               <FontAwesomeIcon icon={faUserTie} className="navbar-icon" />
//               Admin
//             </Link>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;
