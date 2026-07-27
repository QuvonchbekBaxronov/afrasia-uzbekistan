// Central API Base URL Configuration
export const API_BASE = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://afrasia-uzbekistan.onrender.com' // Cloud Render API
    : 'http://localhost:3001'); // Local development
