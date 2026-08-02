export interface AdminDoctor {
    doctor_id: number;
    user_id: number;
    name: string;
    email: string;
    phone_number: string;
    specialization: string;
    consultation_fee: number;
    is_available: boolean;
    hospital_id?: number;
    hospital_name?: string;
}

export interface AdminPatient {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    created_at: string;
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
    patients: AdminPatient[];
    statistics: AdminStatistics | null;
    loading: boolean;
    error: string | null;
}
