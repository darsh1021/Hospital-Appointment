import axiosInstance from "../../api/axios";
import type { AdminDoctor, AdminPatient, AdminStatistics, AdminReceptionist } from "./adminType";

export const getDoctorsAdmin = async (): Promise<{ success: boolean; count: number; doctors: AdminDoctor[] }> => {
    const response = await axiosInstance.get("/api/admin/doctors");
    return response.data;
};

export const createDoctorAdmin = async (data: any): Promise<any> => {
    const response = await axiosInstance.post("/api/admin/doctors", data);
    return response.data;
};

export const createReceptionistAdmin = async (data: any): Promise<any> => {
    const response = await axiosInstance.post("/api/admin/receptionists", data);
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

export const getPatientDetailAdminApi = async (id: string): Promise<any> => {
    const response = await axiosInstance.get(`/api/admin/patient/${id}`);
    return response.data;
};

export const deletePatientAdminApi = async (id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/api/admin/patient/${id}`);
    return response.data;
};

export const getPatientsAdmin = async (search?: string): Promise<{ success: boolean; count: number; patients: AdminPatient[] }> => {
    const url = search ? `/api/admin/patients?search=${search}` : "/api/admin/patients";
    console.log("url", url);
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

export const getReceptionistsAdmin = async (): Promise<{ success: boolean; count: number; receptionists: AdminReceptionist[] }> => {
    const response = await axiosInstance.get("/api/admin/receptionists");
    return response.data;
};
