import api from "../api/axios";

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    full_name: string;
    email: string;
    password: string;
    role: string; // "candidate" | "recruiter" | "admin"
}

export async function login(data: LoginData) {
    const response = await api.post("/auth/login", data);
    return response.data;
}

export async function register(data: RegisterData) {
    const response = await api.post("/auth/register", data);
    return response.data;
}

export async function getCurrentUser(token: string) {
    const response = await api.get("/users/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export async function deleteAccount(token: string) {
    const response = await api.delete("/users/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}