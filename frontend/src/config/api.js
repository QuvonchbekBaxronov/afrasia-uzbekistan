// Central API Base URL Configuration
export const API_BASE = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '/api' // Direct Vercel Serverless API (Instant, No Render Dependency)
    : 'http://localhost:3001'); // Local development
