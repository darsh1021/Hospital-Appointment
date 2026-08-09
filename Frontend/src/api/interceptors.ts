import type { AxiosInstance } from 'axios';
import { logout } from '../Features/auth/authSlice';
import type { store } from '../app/store';

export const setupInterceptors = (axiosInstance: AxiosInstance, reduxStore: typeof store) => {
    // Request Interceptor
    // JWT is stored in an httpOnly cookie — the browser sends it automatically.
    // No need to manually read or attach it here.
    axiosInstance.interceptors.request.use(
        (config) => config,
        (error) => Promise.reject(error)
    );

    // Response Interceptor — dispatch logout on 401 Unauthorized
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.warn("Unauthorized API call — logging out from Redux store");
                // Dispatch logout action to update global auth state.
                // React Router's ProtectedRoute component will reactively redirect
                // the user to /auth/login ONLY if they are trying to access a protected page.
                reduxStore.dispatch(logout());
            }

            return Promise.reject(error);
        }
    );
};
