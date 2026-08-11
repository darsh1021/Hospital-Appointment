import axiosInstance from "../../api/axios";
import type { BookTokenPayload, BookTokenResponse, Appointment } from "./appointmentType";

// Book a patient token
export const bookPatientToken = async (
    data: BookTokenPayload
): Promise<any> => {
    const response = await axiosInstance.post<any>(
        "/api/appointment/book-token",
        data
    );

    return response.data;
};

// Verify booking OTP
export const verifyBookingOtpApi = async (
    data: { phone: string; otp: string }
): Promise<any> => {
    const response = await axiosInstance.post<any>(
        "/api/appointment/verify-booking-otp",
        data
    );
    return response.data;
};

// Fetch patient appointments
export const fetchPatientAppointmentsApi = async (): Promise<{ success: boolean; count: number; appointments: Appointment[] }> => {
    const response = await axiosInstance.get<{ success: boolean; count: number; appointments: Appointment[] }>(
        "/api/patient/appointments"
    );
    return response.data;
};
