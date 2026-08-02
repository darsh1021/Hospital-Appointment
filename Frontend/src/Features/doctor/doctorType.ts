export interface Hospital {
    id: number;
    name: string;
    address: string;
    phone: string;
}

export interface Doctor {
    id: number;
    name: string;
    specialization: string;
    consultation_fee: number;
    is_available: boolean;
    hospital_id?: number;
    hospital_name?: string;
    hospital_address?: string;
}

export interface DoctorAppointment {
    id: number;
    appointment_date: string;
    token_number: number;
    status: "scheduled" | "waiting" | "in-consultation" | "completed" | "cancelled";
    symptoms?: string;
    prescription?: string;
    patient_name: string;
    patient_phone: string;
}

export interface DoctorState {
    doctors: Doctor[];
    hospitals: Hospital[];
    queue: DoctorAppointment[];
    currentPatient: DoctorAppointment | null;
    followups: DoctorAppointment[];
    loading: boolean;
    error: string | null;
}
