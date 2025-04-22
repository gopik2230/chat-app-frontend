import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001" : 'https://chat-app-backend-a0h3.onrender.com',
    withCredentials: true,
})