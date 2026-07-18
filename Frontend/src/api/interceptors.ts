import type { AxiosInstance } from 'axios'
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate()

export const setupInterceptors = (axiosInstance: AxiosInstance) => {
    // Request Interceptor
    axiosInstance.interceptors.request.use((config) => {

        // const token = localStorage.getItem("token");

        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }

        return config;
    },
        (error) => {
            return Promise.reject(error);
        }
    )

    // Response Interceptor
    axiosInstance.interceptors.response.use((response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.log("Unauthorized");
                // logout user

                // redirect login
                navigate('/auth/login')
            }

            return Promise.reject(error);
        }
    )
}

