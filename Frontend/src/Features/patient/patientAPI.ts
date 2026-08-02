import axiosInstance from "../../api/axios";
import type { PatientAppointment, PatientPrescription, PatientProfile } from "./patientType";

export const getPatientAppointmentsApi = async (): Promise<{ success: boolean; count: number; appointments: PatientAppointment[] }> => {
    const response = await axiosInstance.get("/api/patient/appointments");
    return response.data;
};

export const getPatientPrescriptionsApi = async (): Promise<{ success: boolean; count: number; prescriptions: PatientPrescription[] }> => {
    const response = await axiosInstance.get("/api/patient/prescriptions");
    return response.data;
};

export const updatePatientProfileApi = async (data: any): Promise<{ success: boolean; message: string; user: PatientProfile }> => {
    const response = await axiosInstance.put("/api/patient/profile", data);
    return response.data;
};
