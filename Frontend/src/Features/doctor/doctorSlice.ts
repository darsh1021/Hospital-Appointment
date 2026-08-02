import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { 
    getDoctors,
    getHospitals,
    getDoctorQueueApi,
    getCurrentPatientApi,
    updateAppointmentStatusApi,
    completeConsultationApi,
    getDoctorFollowupsApi,
    updateDoctorProfileApi
} from "./doctorAPI";
import type { DoctorState, Doctor, Hospital, DoctorAppointment } from "./doctorType";

const initialState: DoctorState = {
    doctors: [],
    hospitals: [],
    queue: [],
    currentPatient: null,
    followups: [],
    loading: false,
    error: null,
};

export const fetchPublicDoctors = createAsyncThunk(
    "doctor/fetchPublicDoctors",
    async (params: any | undefined, { rejectWithValue }) => {
        try {
            const response = await getDoctors(params);
            return response.doctors;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to fetch doctors");
        }
    }
);

export const fetchHospitals = createAsyncThunk(
    "doctor/fetchHospitals",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getHospitals();
            return response.hospitals;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to fetch hospitals");
        }
    }
);

export const fetchDoctorQueue = createAsyncThunk(
    "doctor/fetchDoctorQueue",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getDoctorQueueApi();
            return response.queue;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to fetch queue");
        }
    }
);

export const fetchCurrentPatient = createAsyncThunk(
    "doctor/fetchCurrentPatient",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCurrentPatientApi();
            return response.patient;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to fetch current patient");
        }
    }
);

export const fetchDoctorFollowups = createAsyncThunk(
    "doctor/fetchDoctorFollowups",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getDoctorFollowupsApi();
            return response.followups;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to fetch followups");
        }
    }
);

export const updateAppointmentStatus = createAsyncThunk(
    "doctor/updateAppointmentStatus",
    async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
        try {
            const response = await updateAppointmentStatusApi(id, status);
            return response.appointment; // Returns updated appointment info
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to update status");
        }
    }
);

export const completeConsultation = createAsyncThunk(
    "doctor/completeConsultation",
    async ({ id, data }: { id: number; data: { symptoms?: string; prescription: string } }, { rejectWithValue }) => {
        try {
            const response = await completeConsultationApi(id, data);
            return response.appointment;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to complete consultation");
        }
    }
);

export const updateDoctorProfile = createAsyncThunk(
    "doctor/updateDoctorProfile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await updateDoctorProfileApi(data);
            return response.profile;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to update profile");
        }
    }
);

const doctorSlice = createSlice({
    name: "doctor",
    initialState,
    reducers: {
        clearDoctorError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Public Doctors
            .addCase(fetchPublicDoctors.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPublicDoctors.fulfilled, (state, action: PayloadAction<Doctor[]>) => {
                state.loading = false;
                state.doctors = action.payload;
            })
            .addCase(fetchPublicDoctors.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            // Hospitals
            .addCase(fetchHospitals.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchHospitals.fulfilled, (state, action: PayloadAction<Hospital[]>) => {
                state.loading = false;
                state.hospitals = action.payload;
            })
            .addCase(fetchHospitals.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            // Queue
            .addCase(fetchDoctorQueue.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchDoctorQueue.fulfilled, (state, action: PayloadAction<DoctorAppointment[]>) => {
                state.loading = false;
                state.queue = action.payload;
            })
            .addCase(fetchDoctorQueue.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            // Current Patient
            .addCase(fetchCurrentPatient.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchCurrentPatient.fulfilled, (state, action: PayloadAction<DoctorAppointment | null>) => {
                state.loading = false;
                state.currentPatient = action.payload;
            })
            .addCase(fetchCurrentPatient.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            // Followups
            .addCase(fetchDoctorFollowups.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchDoctorFollowups.fulfilled, (state, action: PayloadAction<DoctorAppointment[]>) => {
                state.loading = false;
                state.followups = action.payload;
            })
            .addCase(fetchDoctorFollowups.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            // Update Status
            .addCase(updateAppointmentStatus.fulfilled, (state, action: PayloadAction<DoctorAppointment>) => {
                const index = state.queue.findIndex(q => q.id === action.payload.id);
                if (index !== -1) {
                    state.queue[index].status = action.payload.status;
                }
            })
            // Complete Consultation
            .addCase(completeConsultation.fulfilled, (state, action: PayloadAction<DoctorAppointment>) => {
                state.currentPatient = null;
                state.queue = state.queue.filter(q => q.id !== action.payload.id);
            });
    }
});

export const { clearDoctorError } = doctorSlice.actions;
export default doctorSlice.reducer;
