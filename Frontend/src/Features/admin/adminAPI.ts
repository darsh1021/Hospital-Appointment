import axiosInstance from "../../api/axios";
import type { AdminDoctor, AdminPatient, AdminStatistics } from "./adminType";

export const getDoctorsAdmin = async (): Promise<{ success: boolean; count: number; doctors: AdminDoctor[] }> => {
    const response = await axiosInstance.get("/api/admin/doctors");
    return response.data;
};

export const createDoctorAdmin = async (data: any): Promise<any> => {
    const response = await axiosInstance.post("/api/admin/doctors", data);
    return response.data;
};

export const updateDoctorAdmin = async (id: number, data: any): Promise<any> => {
    const response = await axiosInstance.put(`/api/admin/doctors/${id}`, data);
    return response.data;
};

export const deleteDoctorAdmin = async (id: number): Promise<any> => {
    const response = await axiosInstance.delete(`/api/admin/doctors/${id}`);
    return response.data;
};

export const getPatientsAdmin = async (search?: string): Promise<{ success: boolean; count: number; patients: AdminPatient[] }> => {
    const url = search ? `/api/admin/patients?search=${encodeURIComponent(search)}` : "/api/admin/patients";
    const response = await axiosInstance.get(url);
    return response.data;
};

export const getReportsAdmin = async (startDate?: string, endDate?: string): Promise<{ success: boolean; statistics: AdminStatistics }> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await axiosInstance.get(`/api/admin/reports${queryString}`);
    return response.data;
};
