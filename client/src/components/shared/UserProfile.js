import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import { getToken } from '../../services/auth'; // ✅ CORRECT


const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("/api/users/profile/me", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Error fetching profile:", err);
        alert("Failed to fetch profile");
      });
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h3>User Profile</h3>
        <p><strong>Full Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Contact:</strong> {user.contact}</p>
        <p><strong>Location:</strong> {user.location}</p>
        <p><strong>Role:</strong> {user.role?.replace("ROLE_", "")}</p>
      </div>
    </div>
  );
};

export default UserProfile;
