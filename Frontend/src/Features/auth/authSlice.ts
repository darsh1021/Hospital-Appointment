import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { login as loginApi, logout as logoutApi, getCurrentUser, patientLoginApi, bookPatientToken } from "./authApi";
import type { authState, LoginPayload, LoginResponse, User, BookTokenPayload, BookTokenResponse } from "./authType";

const initialState: authState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
};

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

export const loginPatientUser = createAsyncThunk(
    "auth/patientLogin",
    async (data: { name?: string; number?: string; phone_number?: string }, { rejectWithValue }) => {
        try {
            const response = await patientLoginApi(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || error?.response?.data?.message || "Patient login failed");
        }
    }
);

export const bookTokenUser = createAsyncThunk(
    "auth/bookToken",
    async (data: BookTokenPayload, { rejectWithValue }) => {
        try {
            const response = await bookPatientToken(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || error?.response?.data?.message || "Token booking failed");
        }
    }
);

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
        loginSuccess(state, action: PayloadAction<LoginResponse | { user: User }>) {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },

        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },

        setAuthLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            // initializeAuth
            .addCase(initializeAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(initializeAuth.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(initializeAuth.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
            })
            // loginUser
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.user = action.payload.user;
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
            .addCase(loginPatientUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginPatientUser.rejected, (state, action) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = (action.payload as string) || "Patient login failed";
            })
            // bookTokenUser
            .addCase(bookTokenUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(bookTokenUser.fulfilled, (state, action: PayloadAction<BookTokenResponse>) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(bookTokenUser.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Token booking failed";
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
} = authSlice.actions;

export default authSlice.reducer;

