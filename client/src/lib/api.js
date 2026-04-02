// In dev, VITE_API_URL is empty and Vite's proxy forwards /api/* to localhost:5000.
// In production (Vercel), VITE_API_URL is set to the Render backend URL.
export const API_BASE = import.meta.env.VITE_API_URL ?? '';

