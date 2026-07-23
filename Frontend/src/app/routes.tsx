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

// ── Admin Pages ──
import AdminDoctorsPage from '../pages/dashboard/admin/AdminDoctorsPage'
import AdminPatientsPage from '../pages/dashboard/admin/AdminPatientsPage'
import AdminReceptionPage from '../pages/dashboard/admin/AdminReceptionPage'
import AdminReportsPage from '../pages/dashboard/admin/AdminReportsPage'
import AdminSettingsPage from '../pages/dashboard/admin/AdminSettingsPage'

// ── Reception Pages ──
import ReceptionWalkInPage from '../pages/dashboard/reception/ReceptionWalkInPage'
import ReceptionLiveQueuePage from '../pages/dashboard/reception/ReceptionLiveQueuePage'
import ReceptionPaymentsPage from '../pages/dashboard/reception/ReceptionPaymentsPage'
import ReceptionFollowUpPage from '../pages/dashboard/reception/ReceptionFollowUpPage'
import ReceptionRegisterPatientPage from '../pages/dashboard/reception/ReceptionRegisterPatientPage'

// ── Doctor Pages ──
import DoctorQueuePage from '../pages/dashboard/doctor/DoctorQueuePage'
import DoctorCurrentPatientPage from '../pages/dashboard/doctor/DoctorCurrentPatientPage'
import DoctorPrescriptionPage from '../pages/dashboard/doctor/DoctorPrescriptionPage'
import DoctorFollowUpsPage from '../pages/dashboard/doctor/DoctorFollowUpsPage'
import DoctorProfilePage from '../pages/dashboard/doctor/DoctorProfilePage'

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
                            { path: "doctors", element: <AdminDoctorsPage /> },
                            { path: "patients", element: <AdminPatientsPage /> },
                            { path: "reception", element: <AdminReceptionPage /> },
                            { path: "reports", element: <AdminReportsPage /> },
                            { path: "settings", element: <AdminSettingsPage /> },
                        ],
                    },

                    // ── Doctor ──
                    {
                        path: 'doctor',
                        element: <ProtectedRoute allowedRoles={["doctor"]} />,
                        children: [
                            { index: true, element: <DoctorDashboardPage /> },
                            { path: "queue", element: <DoctorQueuePage /> },
                            { path: "current-patient", element: <DoctorCurrentPatientPage /> },
                            { path: "prescription", element: <DoctorPrescriptionPage /> },
                            { path: "follow-ups", element: <DoctorFollowUpsPage /> },
                            { path: "profile", element: <DoctorProfilePage /> },
                        ],
                    },

                    // ── Reception ──
                    {
                        path: 'reception',
                        element: <ProtectedRoute allowedRoles={["reception"]} />,
                        children: [
                            { index: true, element: <ReceptionDashboardPage /> },
                            { path: "walk-in", element: <ReceptionWalkInPage /> },
                            { path: "live-queue", element: <ReceptionLiveQueuePage /> },
                            { path: "payments", element: <ReceptionPaymentsPage /> },
                            { path: "follow-up", element: <ReceptionFollowUpPage /> },
                            { path: "follow-ups", element: <ReceptionFollowUpPage /> },
                            { path: "register", element: <ReceptionRegisterPatientPage /> },
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
