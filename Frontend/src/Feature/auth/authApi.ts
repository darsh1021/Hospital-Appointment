import axiosInstance from "../../api/axios";
import type { LoginPayload, LoginResponse } from "./authType";

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
    try {
        const response = await axiosInstance.post("/api/auth/login", data);
        return response.data;
    }
    catch (error) {
        throw new Error("Login failed");
    }
};

export const logout = async (): Promise<void> => {
    await axiosInstance.post('/api/auth/logout')
}

export const getUser = async () => {
    const response = await axiosInstance.get('/api/auth/profile')
    return response.data;
}   