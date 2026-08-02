import axiosInstance from "../../api/axios";
import type { Doctor, Hospital, DoctorAppointment } from "./doctorType";

// Public routes
export const getDoctors = async (params?: any): Promise<{ success: boolean; count: number; doctors: Doctor[] }> => {
    const response = await axiosInstance.get("/api/doctors", { params });
    return response.data;
};

export const getHospitals = async (): Promise<{ success: boolean; count: number; hospitals: Hospital[] }> => {
    const response = await axiosInstance.get("/api/hospitals");
    return response.data;
};

// Doctor Dashboard routes (Protected)
export const getDoctorQueueApi = async (): Promise<{ success: boolean; count: number; queue: DoctorAppointment[] }> => {
    const response = await axiosInstance.get("/api/doctor/queue");
    return response.data;
};

export const getCurrentPatientApi = async (): Promise<{ success: boolean; patient: DoctorAppointment | null }> => {
    const response = await axiosInstance.get("/api/doctor/current-patient");
    return response.data;
};

export const updateAppointmentStatusApi = async (id: number, status: string): Promise<any> => {
    const response = await axiosInstance.put(`/api/doctor/appointments/${id}/status`, { status });
    return response.data;
};

export const completeConsultationApi = async (id: number, data: { symptoms?: string; prescription: string }): Promise<any> => {
    const response = await axiosInstance.put(`/api/doctor/appointments/${id}/consult`, data);
    return response.data;
};

export const getDoctorFollowupsApi = async (): Promise<{ success: boolean; count: number; followups: DoctorAppointment[] }> => {
    const response = await axiosInstance.get("/api/doctor/follow-ups");
    return response.data;
};

export const updateDoctorProfileApi = async (data: any): Promise<any> => {
    const response = await axiosInstance.put("/api/doctor/profile", data);
    return response.data;
};
