export interface QueueAppointment {
    appointment_id: number;
    token_number: number;
    status: "scheduled" | "waiting" | "in-consultation" | "completed" | "cancelled";
    patient_name: string;
    patient_phone: string;
}

export interface DoctorQueue {
    doctor_id: number;
    doctor_name: string;
    specialization: string;
    is_available: boolean;
    queue: QueueAppointment[];
}

export interface ReceptionState {
    liveQueue: DoctorQueue[];
    loading: boolean;
    error: string | null;
}
