import axios from "axios";

const envUrl = import.meta.env.VITE_API_URL as string | undefined;
const rawBase = (envUrl || "http://127.0.0.1:8000/api/v1").trim().replace(/\/+$/, "");
const baseURL = rawBase.endsWith("/api/v1") ? rawBase : `${rawBase}/api/v1`;

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;