
import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import { getToken } from '../../services/auth'; // ✅ CORRECT

import { Link } from "react-router-dom";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios
      .get("/api/doctors", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err);
        alert("Failed to load doctor list");
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Doctors</h2>
      <div className="row">
        {doctors.map((doc) => (
          <div key={doc.id} className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{doc.fullName}</h5>
                <p className="card-text"><strong>Specialization:</strong> {doc.specialization}</p>
                <p className="card-text"><strong>Area:</strong> {doc.area}</p>
                <p className="card-text"><strong>Rating:</strong> {doc.rating?.toFixed(1) || "N/A"}</p>
                <Link to={`/doctors/${doc.userId}`} className="btn btn-primary btn-sm mt-2">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
        {doctors.length === 0 && (
          <div className="col-12">
            <p>No doctors available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
