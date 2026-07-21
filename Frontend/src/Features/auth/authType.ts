export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'doctor' | 'reception' | 'patient';
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface authState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}