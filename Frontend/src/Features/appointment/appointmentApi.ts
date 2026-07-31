import axiosInstance from "../../api/axios";
import type { BookTokenPayload, BookTokenResponse, Appointment } from "./appointmentType";

// Book a patient token
export const bookPatientToken = async (
    data: BookTokenPayload
): Promise<BookTokenResponse> => {
    const response = await axiosInstance.post<BookTokenResponse>(
        "/api/appointments/book-token",
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
