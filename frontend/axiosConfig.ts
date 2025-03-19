import axios from "axios";
import { useAuth } from "@clerk/nextjs"; // Client-side hook for authentication

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';

// Timeout in milliseconds
const timeout = 2000; // Adjust the timeout value as necessary (2 seconds in this case)

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // API base URL
  timeout, // Timeout for requests
  headers: {
    "Content-Type": "application/json", // Default content type for requests
  },
});

export default axiosInstance;
