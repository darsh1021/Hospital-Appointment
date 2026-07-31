import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { bookPatientToken, fetchPatientAppointmentsApi } from "./appointmentApi";
import type { AppointmentState, BookTokenPayload, BookTokenResponse, Appointment } from "./appointmentType";

const initialState: AppointmentState = {
    appointments: [],
    newlyBookedAppointment: null,
    estimatedWaitTime: null,
    loading: false,
    error: null,
};

// Book an appointment
export const bookAppointmentUser = createAsyncThunk(
    "appointment/bookToken",
    async (data: BookTokenPayload, { rejectWithValue }) => {
        try {
            const response = await bookPatientToken(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.error || 
                error?.response?.data?.message || 
                "Token booking failed"
            );
        }
    }
);

// Fetch patient appointments
export const fetchPatientAppointments = createAsyncThunk(
    "appointment/fetchPatientAppointments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchPatientAppointmentsApi();
            return response.appointments;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.error || 
                error?.response?.data?.message || 
                "Failed to fetch appointments"
            );
        }
    }
);

// Appointment slice
const appointmentSlice = createSlice({
    name: "appointment",
    initialState,
    reducers: {
        // Clear new booking
        clearNewBooking(state) {
            state.newlyBookedAppointment = null;
            state.estimatedWaitTime = null;
            state.error = null;
        },
        // Set appointments list
        setAppointmentsList(state, action: PayloadAction<Appointment[]>) {
            state.appointments = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Book an appointment
            .addCase(bookAppointmentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(bookAppointmentUser.fulfilled, (state, action: PayloadAction<BookTokenResponse>) => {
                state.newlyBookedAppointment = action.payload.appointment;
                state.appointments = action.payload.allAppointments || [];
                state.estimatedWaitTime = action.payload.estimated_wait_time_minutes || null;
                state.loading = false;
                state.error = null;
            })
            .addCase(bookAppointmentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Token booking failed";
            })

            // Fetch patient appointments
            .addCase(fetchPatientAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPatientAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
                state.appointments = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchPatientAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch appointments";
            });
    },
});

export const { clearNewBooking, setAppointmentsList } = appointmentSlice.actions;
export default appointmentSlice.reducer;
