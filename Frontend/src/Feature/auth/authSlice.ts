import { createSlice } from '@reduxjs/toolkit'
import type { authState } from './authType'

const initialState: authState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        }

    }
})


export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer