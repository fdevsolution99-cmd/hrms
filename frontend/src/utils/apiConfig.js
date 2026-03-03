// src/utils/apiConfig.js

// Export the API base URL, falling back to local backend if env is not set
export const API_BASE = import.meta.env.VITE_API_URL || 'https://hrms-bice-two.vercel.app' || 'https://hrms-ctqu.onrender.com';

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};