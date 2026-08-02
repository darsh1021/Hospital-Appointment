import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import {
    getDoctorsAdmin as getDoctorsAdminApi,
    createDoctorAdmin as createDoctorAdminApi,
    updateDoctorAdmin as updateDoctorAdminApi,
    deleteDoctorAdmin as deleteDoctorAdminApi,
    getPatientsAdmin as getPatientsAdminApi,
    getReportsAdmin as getReportsAdminApi
} from "./adminAPI";
import type { AdminState, AdminDoctor, AdminPatient, AdminStatistics } from "./adminType";

const initialState: AdminState = {
    doctors: [],
    patients: [],
    statistics: null,
    loading: false,
    error: null,
};

export const fetchDoctorsAdmin = createAsyncThunk(
    "admin/fetchDoctors",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getDoctorsAdminApi();
            return response.doctors;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to fetch doctors");
        }
    }
);

export const addDoctorAdmin = createAsyncThunk(
    "admin/addDoctor",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await createDoctorAdminApi(data);
            return response.doctor; // Return created doctor to append to state
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to add doctor");
        }
    }
);

export const updateDoctorDetailsAdmin = createAsyncThunk(
    "admin/updateDoctor",
    async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
        try {
            await updateDoctorAdminApi(id, data);
            return { id, data }; // Return updated data
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to update doctor");
        }
    }
);

export const removeDoctorAdmin = createAsyncThunk(
    "admin/removeDoctor",
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteDoctorAdminApi(id);
            return id; // Return deleted id
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to delete doctor");
        }
    }
);

export const fetchPatientsAdmin = createAsyncThunk(
    "admin/fetchPatients",
    async (search: string | undefined, { rejectWithValue }) => {
        try {
            const response = await getPatientsAdminApi(search);
            return response.patients;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to fetch patients");
        }
    }
);

export const fetchReportsAdmin = createAsyncThunk(
    "admin/fetchReports",
    async ({ startDate, endDate }: { startDate?: string; endDate?: string } = {}, { rejectWithValue }) => {
        try {
            const response = await getReportsAdminApi(startDate, endDate);
            return response.statistics;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || "Failed to fetch reports");
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearAdminError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Doctors
            .addCase(fetchDoctorsAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctorsAdmin.fulfilled, (state, action: PayloadAction<AdminDoctor[]>) => {
                state.loading = false;
                state.doctors = action.payload;
            })
            .addCase(fetchDoctorsAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add Doctor
            .addCase(addDoctorAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addDoctorAdmin.fulfilled, (state, action: PayloadAction<AdminDoctor>) => {
                state.loading = false;
                state.doctors.push(action.payload);
            })
            .addCase(addDoctorAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Doctor
            .addCase(updateDoctorDetailsAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDoctorDetailsAdmin.fulfilled, (state, action: PayloadAction<{ id: number; data: any }>) => {
                state.loading = false;
                const index = state.doctors.findIndex(d => d.doctor_id === action.payload.id);
                if (index !== -1) {
                    state.doctors[index] = { ...state.doctors[index], ...action.payload.data };
                }
            })
            .addCase(updateDoctorDetailsAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Remove Doctor
            .addCase(removeDoctorAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeDoctorAdmin.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.doctors = state.doctors.filter(d => d.doctor_id !== action.payload);
            })
            .addCase(removeDoctorAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Patients
            .addCase(fetchPatientsAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPatientsAdmin.fulfilled, (state, action: PayloadAction<AdminPatient[]>) => {
                state.loading = false;
                state.patients = action.payload;
            })
            .addCase(fetchPatientsAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Reports
            .addCase(fetchReportsAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReportsAdmin.fulfilled, (state, action: PayloadAction<AdminStatistics>) => {
                state.loading = false;
                state.statistics = action.payload;
            })
            .addCase(fetchReportsAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
