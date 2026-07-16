import { createBrowserRouter } from 'react-router-dom'
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../layouts/ProtectedRoute';


export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <h1 className="text-center text-2xl">Clinic Management System</h1>
            },
            {
                path: "about",
                element: <h1 className="text-center text-2xl">About Us</h1>,
            },
            {
                path: 'treatments',
                element: <h1 className="text-center text-2xl">Treatments</h1>
            },
            {
                path: 'doctors',
                element: <h1 className="text-center text-2xl">Our Doctors</h1>
            },
            {
                path: 'book-token',
                element: <h1 className="text-center text-2xl">Book Token</h1>
            },
            {
                path: 'live-queue',
                element: <h1 className="text-center text-2xl">Live Queue</h1>
            },
            {
                path: 'contact',
                element: <h1 className="text-center text-2xl">Contact Us</h1>
            }
        ]
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <h1 className="text-center text-2xl">Login</h1>
            },
            {
                path: 'forgot-password',
                element: <h1 className="text-center text-2xl">Forgot Password</h1>
            },
            {
                path: 'reset-password',
                element: <h1 className="text-center text-2xl">Reset Password</h1>
            }
        ]
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute
                isAuthenticated={true}
                allowedRoles={["admin", "doctor", "reception", "patient"]}
                userRole={"admin"}
            />
        ),
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    {
                        path: 'admin',
                        element: <ProtectedRoute allowedRoles={["admin"]} userRole={"admin"} />,
                        children: [
                            {
                                index: true,
                                element: <h1 className="text-center text-2xl">Admin Dashboard</h1>,
                            },
                            {
                                path: "doctors",
                                element: <h1 className="text-center text-2xl">Manage Doctors</h1>,
                            },
                            {
                                path: "patients",
                                element: <h1 className="text-center text-2xl">Manage Patients</h1>,
                            },
                            {
                                path: "reports",
                                element: <h1 className="text-center text-2xl">Generate Reports</h1>,
                            },
                            {
                                path: "settings",
                                element: <h1 className="text-center text-2xl">Admin Settings</h1>,
                            },
                        ]
                    },

                    {
                        path: 'doctor',
                        element: <ProtectedRoute allowedRoles={["doctor"]} userRole={"doctor"} />,
                        children: [
                            {
                                index: true,
                                element: <h1 className="text-center text-2xl">Doctor Dashboard</h1>,
                            },
                            {
                                path: "queue",
                                element: <h1 className="text-center text-2xl">Manage Queue</h1>,
                            },
                            {
                                path: "current-patient",
                                element: <h1 className="text-center text-2xl">Current Patient</h1>,
                            },
                            {
                                path: "prescription",
                                element: <h1 className="text-center text-2xl">Prescription</h1>,
                            },
                            {
                                path: "follow-ups",
                                element: <h1 className="text-center text-2xl">Follow-ups</h1>,
                            },
                            {
                                path: "profile",
                                element: <h1 className="text-center text-2xl">Doctor Profile</h1>,
                            },
                        ]
                    },

                    {
                        path: 'reception',
                        element: <ProtectedRoute allowedRoles={["reception"]} userRole={"reception"} />,
                        children: [
                            {
                                index: true,
                                element: <h1 className="text-center text-2xl">Reception Dashboard</h1>,
                            },
                            {
                                path: "register-patient",
                                element: <h1 className="text-center text-2xl">Register Patient</h1>,
                            },
                            {
                                path: "walk-in",
                                element: <h1 className="text-center text-2xl">Walk-in Patients</h1>,
                            },
                            {
                                path: "live-queue",
                                element: <h1 className="text-center text-2xl">Live Queue</h1>,
                            },
                            {
                                path: "payments",
                                element: <h1 className="text-center text-2xl">Payments</h1>,
                            },
                            {
                                path: "follow-up",
                                element: <h1 className="text-center text-2xl">Follow-up Patients</h1>,
                            },
                        ]
                    },

                    {
                        path: 'patient',
                        element: <ProtectedRoute allowedRoles={["patient"]} userRole={"patient"} />,
                        children: [
                            {
                                index: true,
                                element: <h1 className="text-center text-2xl">Patient Dashboard</h1>,
                            },
                            {
                                path: "appointments",
                                element: <h1 className="text-center text-2xl">Appointments</h1>,
                            },
                            {
                                path: "prescriptions",
                                element: <h1 className="text-center text-2xl">Prescriptions</h1>,
                            },
                            {
                                path: "reports",
                                element: <h1 className="text-center text-2xl">Medical Reports</h1>,
                            },
                            {
                                path: "profile",
                                element: <h1 className="text-center text-2xl">Patient Profile</h1>,
                            },
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: "*",
        element: <h1 className="text-center text-2xl">404 Not Found</h1>,
    },

])