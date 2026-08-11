import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { login as loginApi, logout as logoutApi, getCurrentUser, patientLoginApi, verifyOtpApi } from "./authApi";
import type { authState, LoginPayload, LoginResponse, User } from "./authType";
import { verifyBookingOtpThunk } from "../appointment/appointmentSlice";

const mapApiUser = (user: any): User | null => {
    if (!user) return null;
    return {
        ...user,
        phone_number: user.phone_number || user.phone || "",
    };
};

const initialState: authState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    initializing: true,
    error: null,
};

// Initialize authentication
export const initializeAuth = createAsyncThunk(
    "auth/initialize",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCurrentUser();
            return response.user;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Session initialization failed");
        }
    }
);

// Login a user
export const loginUser = createAsyncThunk(
    "auth/login",
    async (data: LoginPayload, { rejectWithValue }) => {
        try {
            const response = await loginApi(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || error?.response?.data?.message || "Login failed");
        }
    }
);

// Login a patient
export const loginPatientUser = createAsyncThunk(
    "auth/patientLogin",
    async (data: { name: string; phone: string }, { rejectWithValue }) => {
        try {
            const response = await patientLoginApi(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || error?.response?.data?.message || "Patient login failed");
        }
    }
);

// Verify patient OTP
export const verifyPatientOtp = createAsyncThunk(
    "auth/verifyPatientOtp",
    async (data: { phone: string; otp: string }, { rejectWithValue }) => {
        try {
            const response = await verifyOtpApi(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || error?.response?.data?.message || "OTP verification failed");
        }
    }
);

// Logout a user
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await logoutApi();
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Logout failed");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Login success
        loginSuccess(state, action: PayloadAction<LoginResponse | { user: User }>) {
            state.user = mapApiUser(action.payload.user);
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },

        // Logout
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },

        // Set auth loading
        setAuthLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },

        // Clear auth error
        clearError(state) {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // initializeAuth
            .addCase(initializeAuth.pending, (state) => {
                state.initializing = true;
            })
            .addCase(initializeAuth.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = mapApiUser(action.payload);
                state.isAuthenticated = true;
                state.initializing = false;
                state.loading = false;
                state.error = null;
            })
            .addCase(initializeAuth.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.initializing = false;
                state.loading = false;
            })

            // loginUser
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.user = mapApiUser(action.payload.user);
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = (action.payload as string) || "Login failed";
            })

            // loginPatientUser
            .addCase(loginPatientUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginPatientUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(loginPatientUser.rejected, (state, action) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = (action.payload as string) || "Patient login failed";
            })

            // verifyPatientOtp
            .addCase(verifyPatientOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyPatientOtp.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.user = mapApiUser(action.payload.user);
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(verifyPatientOtp.rejected, (state, action) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = (action.payload as string) || "OTP verification failed";
            })

            // verifyBookingOtpThunk
            .addCase(verifyBookingOtpThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyBookingOtpThunk.fulfilled, (state, action) => {
                // The backend returns a `patient` object (not `user`) on book-token.
                // Build the auth user from it so the patient sidebar/role resolves correctly.
                const resp: any = action.payload;
                const user = resp?.user ?? (resp?.patient
                    ? {
                        id: resp.patient.id,
                        name: resp.patient.name,
                        phone_number: resp.patient.phone,
                        role: "patient" as const,
                    }
                    : null);

                state.user = mapApiUser(user);
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(verifyBookingOtpThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Booking verification failed";
            })

            // logoutUser
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
            });
    },
});

export const {
    loginSuccess,
    logout,
    setAuthLoading,
    clearError,
} = authSlice.actions;

export default authSlice.reducer;

