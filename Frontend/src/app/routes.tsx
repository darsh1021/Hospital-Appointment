import { createBrowserRouter } from 'react-router-dom'
import RootLayout from "../layouts/RootLayout"
import AuthLayout from "../layouts/AuthLayout"
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from '../layouts/ProtectedRoute'

// ── Public pages (RootLayout) ──
import HomePage from '../pages/public/HomePage'
import AboutPage from '../pages/public/AboutPage'
import TreatmentsPage from '../pages/public/TreatmentsPage'
import DoctorsPage from '../pages/public/DoctorsPage'
import BookTokenPage from '../pages/public/BookTokenPage'
import ContactPage from '../pages/public/ContactPage'

// ── Auth pages (AuthLayout) ──
import LoginPage from '../pages/auth/LoginPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'

// ── Misc ──
import NotFoundPage from '../pages/NotFoundPage'

// ── Dashboard Pages ──
import AdminDashboardPage from '../pages/dashboard/AdminDashboardPage'
import DoctorDashboardPage from '../pages/dashboard/DoctorDashboardPage'
import ReceptionDashboardPage from '../pages/dashboard/ReceptionDashboardPage'
import PatientDashboardPage from '../pages/dashboard/PatientDashboardPage'

// ── Patient Pages ──
import PatientAppointmentsPage from '../pages/dashboard/patient/PatientAppointmentsPage'
import PatientPrescriptionsPage from '../pages/dashboard/patient/PatientPrescriptionsPage'
import PatientRecordPage from '../pages/dashboard/patient/PatientRecordPage'
import PatientProfilePage from '../pages/dashboard/patient/PatientProfilePage'


export const router = createBrowserRouter([
    // ────────────────────────────────────────────────
    // PUBLIC — RootLayout (Navbar + Footer)
    // ────────────────────────────────────────────────
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'about', element: <AboutPage /> },
            { path: 'treatments', element: <TreatmentsPage /> },
            { path: 'doctors', element: <DoctorsPage /> },
            { path: 'book-token', element: <BookTokenPage /> },
            { path: 'contact', element: <ContactPage /> },
        ],
    },

    // ────────────────────────────────────────────────
    // AUTH — AuthLayout (centred, no Navbar)
    // ────────────────────────────────────────────────
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <LoginPage /> },
            { path: 'forgot-password', element: <ForgotPasswordPage /> },
            { path: 'reset-password', element: <ResetPasswordPage /> },
        ],
    },

    // ────────────────────────────────────────────────
    // DASHBOARD — DashboardLayout (Sidebar + Header)
    // ────────────────────────────────────────────────
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute allowedRoles={["admin", "doctor", "reception", "patient"]} />
        ),
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    // ── Admin ──
                    {
                        path: 'admin',
                        element: <ProtectedRoute allowedRoles={["admin"]} />,
                        children: [
                            { index: true, element: <AdminDashboardPage /> },
                            { path: "doctors", element: <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Manage Doctors...</h1> },
                            { path: "patients", element: <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Manage Patients</h1> },
                            { path: "reception", element: <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Manage Reception</h1> },
                            { path: "reports", element: <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Generate Reports</h1> },
                            { path: "settings", element: <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Admin Settings</h1> },
                        ],
                    },

                    // ── Doctor ──
                    {
                        path: 'doctor',
                        element: <ProtectedRoute allowedRoles={["doctor"]} />,
                        children: [
                            { index: true, element: <DoctorDashboardPage /> },
                            { path: "queue", element: <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Manage Queue</h1> },
                            { path: "current-patient", element: <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Current Patient</h1> },
                            { path: "prescription", element: <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Prescription</h1> },
                            { path: "follow-ups", element: <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Follow-ups</h1> },
                            { path: "profile", element: <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Doctor Profile</h1> },
                        ],
                    },

                    // ── Reception ──
                    {
                        path: 'reception',
                        element: <ProtectedRoute allowedRoles={["reception"]} />,
                        children: [
                            { index: true, element: <ReceptionDashboardPage /> },
                            { path: "register-patient", element: <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Register Patient</h1> },
                            { path: "walk-in", element: <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Walk-in Patients</h1> },
                            { path: "live-queue", element: <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Live Queue</h1> },
                            { path: "payments", element: <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Payments</h1> },
                            { path: "follow-up", element: <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Follow-up Patients</h1> },
                        ],
                    },

                    // ── Patient ──
                    {
                        path: 'patient',
                        element: <ProtectedRoute allowedRoles={["patient"]} />,
                        children: [
                            { index: true, element: <PatientDashboardPage /> },
                            { path: "appointments", element: <PatientAppointmentsPage /> },
                            { path: "prescriptions", element: <PatientPrescriptionsPage /> },
                            { path: "record", element: <PatientRecordPage /> },
                            { path: "profile", element: <PatientProfilePage /> },
                        ],
                    },
                ],
            },
        ],
    },

    // ── 404 ──
    { path: '*', element: <NotFoundPage /> },
])
