import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { 
    getLiveQueueApi,
    updateAppointmentStatusApi,
    registerPatientApi,
    walkInApi,
    createPaymentApi
} from "./receptionAPI";
import type { ReceptionState, DoctorQueue } from "./receptionType";

const initialState: ReceptionState = {
    liveQueue: [],
    loading: false,
    error: null,
};

export const fetchLiveQueue = createAsyncThunk(
    "reception/fetchLiveQueue",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getLiveQueueApi();
            return response.doctors;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to fetch live queue");
        }
    }
);

export const updateQueueStatus = createAsyncThunk(
    "reception/updateQueueStatus",
    async ({ id, status }: { id: number; status: string }, { rejectWithValue, dispatch }) => {
        try {
            const response = await updateAppointmentStatusApi(id, status);
            dispatch(fetchLiveQueue());
            return response.appointment;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to update status");
        }
    }
);

export const registerNewPatient = createAsyncThunk(
    "reception/registerNewPatient",
    async (data: { name: string; phone_number: string; email?: string }, { rejectWithValue }) => {
        try {
            const response = await registerPatientApi(data);
            return response.patient;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to register patient");
        }
    }
);

export const registerWalkIn = createAsyncThunk(
    "reception/registerWalkIn",
    async (data: { patient_id: number; doctor_id: number; symptoms?: string }, { rejectWithValue, dispatch }) => {
        try {
            const response = await walkInApi(data);
            dispatch(fetchLiveQueue());
            return response.appointment;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to register walk-in");
        }
    }
);

export const recordPayment = createAsyncThunk(
    "reception/recordPayment",
    async (data: { appointment_id: number; amount: number; method: string }, { rejectWithValue }) => {
        try {
            const response = await createPaymentApi(data);
            return response.payment;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to record payment");
        }
    }
);


const receptionSlice = createSlice({
    name: "reception",
    initialState,
    reducers: {
        clearReceptionError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Live Queue
            .addCase(fetchLiveQueue.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchLiveQueue.fulfilled, (state, action: PayloadAction<DoctorQueue[]>) => {
                state.loading = false;
                state.liveQueue = action.payload;
            })
            .addCase(fetchLiveQueue.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            
            // Other actions primarily handled without placing their individual results in state
            // Status Update
            .addCase(updateQueueStatus.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateQueueStatus.fulfilled, (state) => { state.loading = false; })
            .addCase(updateQueueStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            
            // Patient Registration
            .addCase(registerNewPatient.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(registerNewPatient.fulfilled, (state) => { state.loading = false; })
            .addCase(registerNewPatient.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            
            // Walk In
            .addCase(registerWalkIn.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(registerWalkIn.fulfilled, (state) => { state.loading = false; })
            .addCase(registerWalkIn.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            
            // Record Payment
            .addCase(recordPayment.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(recordPayment.fulfilled, (state) => { state.loading = false; })
            .addCase(recordPayment.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    }
});

export const { clearReceptionError } = receptionSlice.actions;
export default receptionSlice.reducer;
