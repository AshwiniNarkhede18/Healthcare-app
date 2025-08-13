// src/pages/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    contact: '',
    location: '',
    role: 'ROLE_USER',
    specialization: '',
    qualification: '',
    experienceYears: '',
    fee: '',
    hospitalName: '',
    city: '',
    state: ''
  });

  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log("hii");
      await axios.post('http://localhost:8081/api/auth/register', form);
      console.log("hello");
      alert('Registration successful! Please login.');
      console.log("register");
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Registration failed. Email might already be in use.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Full Name</label>
          <input name="fullName" onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input name="email" type="email" onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input name="password" type="password" onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Contact</label>
          <input name="contact" onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Location</label>
          <input name="location" onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select name="role" onChange={handleChange} className="form-select">
            <option value="ROLE_USER">User</option>
            <option value="ROLE_DOCTOR">Doctor</option>
          </select>
        </div>

        {form.role === 'ROLE_DOCTOR' && (
          <>
            <div className="mb-3">
              <label>Specialization</label>
              <input name="specialization" onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <label>Qualification</label>
              <input name="qualification" onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <label>Experience (years)</label>
              <input name="experienceYears" onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <label>Fee</label>
              <input name="fee" onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <label>Hospital Name</label>
              <input name="hospitalName" onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <label>City</label>
              <input name="city" onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <label>State</label>
              <input name="state" onChange={handleChange} className="form-control" />
            </div>
          </>
        )}

        {error && <p className="text-danger">{error}</p>}
        <button className="btn btn-success">Register</button>
      </form>
    </div>
  );
};

export default Register;
