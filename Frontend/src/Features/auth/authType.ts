
export interface User {
    id: string | number;
    name: string;
    email?: string;
    role: 'admin' | 'doctor' | 'reception' | 'patient';
}

export interface LoginPayload {
    email?: string;
    password?: string;
    name?: string;
    number?: string;
}

export interface LoginResponse {
    success?: boolean;
    user: User;
    token?: string;
}

export interface BookTokenPayload {
    name: string;
    phone?: string;
    phone_number?: string;
    department?: string;
    doctor_id?: number | string;
    appointment_date?: string;
    symptoms?: string;
}

export interface BookTokenResponse {
    success: boolean;
    token?: string;
    user: User;
    appointment: any;
    estimated_wait_time_minutes?: number;
}

export interface authState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}
