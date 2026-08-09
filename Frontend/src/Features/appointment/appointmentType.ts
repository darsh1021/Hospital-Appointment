import type { User } from "../auth/authType";

// Appointment interface  
export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  hospital_id: number;
  appointment_date: string;
  token_number: number;
  status: 'waiting' | 'in-consultation' | 'completed' | 'cancelled';
  symptoms?: string;
  prescription?: string;
  created_at: string;
  doctor_name?: string;
  doctor_specialization?: string;
  hospital_name?: string;
  hospital_address?: string;
}

// Booking token payload interface
export interface BookTokenPayload {
  name: string;
  phone: string;
  category: string;
  gender: string;
  dob: string;
}

// Booking token response interface
export interface BookTokenResponse {
  success: boolean;
  token?: string;
  user: User;
  appointment: Appointment;
  estimated_wait_time_minutes?: number;
  allAppointments?: Appointment[];
}

// Appointment state interface
export interface AppointmentState {
  appointments: Appointment[];
  newlyBookedAppointment: Appointment | null;
  estimatedWaitTime: number | null;
  loading: boolean;
  error: string | null;
}
