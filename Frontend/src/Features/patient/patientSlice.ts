import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { 
    getPatientAppointmentsApi,
    getPatientPrescriptionsApi,
    updatePatientProfileApi
} from "./patientAPI";
import type { PatientState, PatientAppointment, PatientPrescription } from "./patientType";

const initialState: PatientState = {
    appointments: [],
    prescriptions: [],
    loading: false,
    error: null,
};

export const fetchPatientAppointments = createAsyncThunk(
    "patient/fetchPatientAppointments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getPatientAppointmentsApi();
            return response.appointments;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to fetch appointments");
        }
    }
);

export const fetchPatientPrescriptions = createAsyncThunk(
    "patient/fetchPatientPrescriptions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getPatientPrescriptionsApi();
            return response.prescriptions;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to fetch prescriptions");
        }
    }
);

export const updatePatientProfile = createAsyncThunk(
    "patient/updatePatientProfile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await updatePatientProfileApi(data);
            return response.user;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to update profile");
        }
    }
);

const patientSlice = createSlice({
    name: "patient",
    initialState,
    reducers: {
        clearPatientError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Appointments
            .addCase(fetchPatientAppointments.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPatientAppointments.fulfilled, (state, action: PayloadAction<PatientAppointment[]>) => {
                state.loading = false;
                state.appointments = action.payload;
            })
            .addCase(fetchPatientAppointments.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            // Prescriptions
            .addCase(fetchPatientPrescriptions.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPatientPrescriptions.fulfilled, (state, action: PayloadAction<PatientPrescription[]>) => {
                state.loading = false;
                state.prescriptions = action.payload;
            })
            .addCase(fetchPatientPrescriptions.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            // Profile Update (handled lightly here, auth slice handles main user data)
            .addCase(updatePatientProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updatePatientProfile.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updatePatientProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    }
});

export const { clearPatientError } = patientSlice.actions;
export default patientSlice.reducer;
