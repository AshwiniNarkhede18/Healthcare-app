import React, { useState, useEffect } from "react";
import axios from "../../services/api";
import { getToken } from '../../services/auth'; // ✅ CORRECT

import { Link } from "react-router-dom";

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    axios
      .get("/api/doctors", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => {
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch doctors", err);
        alert("Unable to load doctors");
      });
  }, []);

  const handleSearch = () => {
    let results = doctors;

    if (searchName) {
      results = results.filter((doc) =>
        doc.fullName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (specialization) {
      results = results.filter((doc) =>
        doc.specialization.toLowerCase().includes(specialization.toLowerCase())
      );
    }

    if (location) {
      results = results.filter((doc) =>
        doc.area.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFilteredDoctors(results);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Search Doctors</h2>

      <div className="row mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="row">
        {filteredDoctors.length === 0 && (
          <p className="text-muted">No doctors found.</p>
        )}
        {filteredDoctors.map((doc) => (
          <div className="col-md-4 mb-4" key={doc.id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{doc.fullName}</h5>
                <p className="card-text"><strong>Specialization:</strong> {doc.specialization}</p>
                <p className="card-text"><strong>Area:</strong> {doc.area}</p>
                <p className="card-text"><strong>Rating:</strong> {doc.rating?.toFixed(1) || "N/A"}</p>
                <Link to={`/doctors/${doc.userId}`} className="btn btn-outline-primary btn-sm mt-2">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorSearch;
