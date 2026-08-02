import axiosInstance from "../../api/axios";
import type { DoctorQueue } from "./receptionType";

export const registerPatientApi = async (data: { name: string; phone_number: string; email?: string }): Promise<any> => {
    const response = await axiosInstance.post("/api/reception/register-patient", data);
    return response.data;
};

export const walkInApi = async (data: { patient_id: number; doctor_id: number; symptoms?: string }): Promise<any> => {
    const response = await axiosInstance.post("/api/reception/walk-in", data);
    return response.data;
};

export const getLiveQueueApi = async (): Promise<{ success: boolean; doctors: DoctorQueue[] }> => {
    const response = await axiosInstance.get("/api/reception/live-queue");
    return response.data;
};

export const updateAppointmentStatusApi = async (id: number, status: string): Promise<any> => {
    const response = await axiosInstance.put(`/api/reception/appointments/${id}/status`, { status });
    return response.data;
};

export const createPaymentApi = async (data: { appointment_id: number; amount: number; method: string }): Promise<any> => {
    const response = await axiosInstance.post("/api/reception/payments", data);
    return response.data;
};
