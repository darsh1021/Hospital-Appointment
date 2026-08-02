export interface PatientAppointment {
    id: number;
    appointment_date: string;
    token_number: number;
    status: "scheduled" | "waiting" | "in-consultation" | "completed" | "cancelled";
    symptoms?: string;
    prescription?: string;
    created_at: string;
    doctor_name: string;
    doctor_specialization: string;
    hospital_name: string;
    hospital_address: string;
}

export interface PatientPrescription {
    id: number;
    appointment_date: string;
    prescription: string;
    symptoms?: string;
    doctor_name: string;
    doctor_specialization: string;
}

export interface PatientProfile {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    role: string;
    created_at: string;
}

export interface PatientState {
    appointments: PatientAppointment[];
    prescriptions: PatientPrescription[];
    loading: boolean;
    error: string | null;
}
