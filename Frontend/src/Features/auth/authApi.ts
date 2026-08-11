import axiosInstance from "../../api/axios";
import type { LoginPayload, LoginResponse } from "./authType";

// Authenticate a user with email/username and password.
export const login = async (
    data: LoginPayload
): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
        "/api/auth/login",
        data
    );

    return response.data;
};


// Login a patient using name or phone number.
export const patientLoginApi = async (
    data: { name: string; phone: string }
): Promise<any> => {
    const response = await axiosInstance.post<any>(
        "/api/auth/patient-login",
        data
    );

    return response.data;
};

// Verify OTP for patient login
export const verifyOtpApi = async (
    data: { phone: string; otp: string }
): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
        "/api/auth/verify-otp",
        data
    );

    return response.data;
};

// Log out the currently authenticated user.
export const logout = async (): Promise<void> => {
    await axiosInstance.post("/api/auth/logout");
};

// Retrieve the profile of the currently logged-in user.
export const getCurrentUser = async () => {
    const response = await axiosInstance.get("/api/auth/profile");

    return response.data;
};

