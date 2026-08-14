export interface AdminDoctor {
    id: number;
    user_id: number;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    consultation_fee: number;
    experience: number;
    status: string;
    hospital_id?: number;
    hospital_name?: string;
    gender?: string;
    dob?: string;
    address?: string;
    qualification?: string;
    avatar?: string;
}

export interface AdminReceptionist {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    gender: string;
    dob?: string;
    address?: string;
    qualification?: string;
    avatar?: string;
    hospital_id?: string;
    hospital_name?: string;
}

export interface AdminPatient {
    id: string;
    name: string;
    phone: string;
    age: number | null;
    address: string | null;
    created_at: string;
    total_appointments: number;
    last_visit: string | null;
}

export interface DoctorUtilization {
    doctor_id: number;
    doctor_name: string;
    total_appointments: number;
    completed_appointments: number;
    utilization_rate_percentage: number;
}

export interface AdminStatistics {
    total_appointments: number;
    revenue_generated: number;
    average_waiting_time_minutes: number;
    doctor_utilization: DoctorUtilization[];
}

export interface AdminState {
    doctors: AdminDoctor[];
    receptionists: AdminReceptionist[];
    patients: AdminPatient[];
    patientDetails: AdminPatient[];
    statistics: AdminStatistics | null;
    loading: boolean;
    error: string | null;
}
