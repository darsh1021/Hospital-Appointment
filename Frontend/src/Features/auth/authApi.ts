import axiosInstance from "../../api/axios";
import type { LoginPayload, LoginResponse, BookTokenPayload, BookTokenResponse } from "./authType";

export const login = async (
    data: LoginPayload
): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
        "/api/auth/login",
        data
    );

    return response.data;
};

export const patientLoginApi = async (
    data: { name?: string; number?: string; phone_number?: string }
): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
        "/api/auth/patient-login",
        data
    );

    return response.data;
};

export const bookPatientToken = async (
    data: BookTokenPayload
): Promise<BookTokenResponse> => {
    const response = await axiosInstance.post<BookTokenResponse>(
        "/api/appointments/book-token",
        data
    );

    return response.data;
};

export const logout = async (): Promise<void> => {
    await axiosInstance.post("/api/auth/logout");
};

export const getCurrentUser = async () => {
    const response = await axiosInstance.get("/api/auth/profile");

    return response.data;
};
