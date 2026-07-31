
// User data interface
export interface User {
    id: string | number;
    name: string;
    email?: string;
    role: 'admin' | 'doctor' | 'reception' | 'patient';
}

// Login payload interface
export interface LoginPayload {
    email?: string;
    password?: string;
    name?: string;
    number?: string;
}


// Login response interface
export interface LoginResponse {
    success?: boolean;
    user: User;
    token?: string;
}

// Auth state interface
export interface authState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

