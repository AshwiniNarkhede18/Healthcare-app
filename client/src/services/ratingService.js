// src/services/ratingService.js
import { getAuthToken } from "./auth"; // if you store JWT token in localStorage or cookies

const API_BASE_URL = "/api/ratings"; // ✅ adjust this to your backend endpoint

// Add a new rating
export async function addRating(ratingRequest) {
  const token = getAuthToken(); // If authentication is required
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(ratingRequest),
  });

  if (!response.ok) {
    throw new Error(`Error adding rating: ${response.statusText}`);
  }

  return await response.json();
}

// Get all ratings
export async function getRatings() {
  const token = getAuthToken();
  const response = await fetch(API_BASE_URL, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching ratings: ${response.statusText}`);
  }

  return await response.json();
}

// Get ratings for a specific doctor
export async function getRatingsByDoctor(doctorId) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/doctor/${doctorId}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching ratings for doctor ${doctorId}`);
  }

  return await response.json();
}
