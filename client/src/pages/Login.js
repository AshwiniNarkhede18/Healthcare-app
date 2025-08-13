// src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { saveToken } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:8081/api/auth/login', {
      email,
      password
    });

    const token = res.data.token;
    saveToken(token);

    // Decode JWT to get user info and role
    const decoded = jwtDecode(token);
    const role = decoded.role || decoded.roles?.[0];

    // ✅ Save user info to localStorage
    localStorage.setItem('user', JSON.stringify(decoded));

    alert('Login successful!');

    // Redirect based on role
    if (role === 'ROLE_DOCTOR') {
      navigate('/doctor/dashboard');
    } else if (role === 'ROLE_USER') {
      navigate('/user/dashboard');
    } else {
      navigate('/login'); // fallback
    }

  } catch (err) {
    setError('Invalid credentials');
  }
};


  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
