# Frontend Program Flow & Architecture Documentation

Welcome to the frontend documentation for the **hospital queue managegment system**. This document serves as a guide for new developers to quickly understand the execution flow, state management, route protection, and design decisions of the frontend application.

---

## 1. Technical Stack Overview

The frontend is built as a Single Page Application (SPA) using:
*   **Core Library**: React (v18) with TypeScript.
*   **Build Tool**: Vite (fast builds, hot module replacement, and modern environment configuration).
*   **Routing**: React Router DOM (v6) using modern Data APIs (`createBrowserRouter`, `RouterProvider`).
*   **State Management**: Redux Toolkit (RTK) for predictable global state and async logic.
*   **HTTP Client**: Axios with global interceptors.
*   **Real-time Synced Queue**: Socket.io-client for bi-directional live queue updates.
*   **Styling**: Tailwind CSS & Vanilla CSS (using Radix-based UI components).

---

## 2. Global Execution Flow

The initialization and rendering flow of the frontend follows this sequence:

```mermaid
flowchart TD
    A[src/main.tsx: Entry Point] --> B[setupInterceptors: Axios Interceptor Setup]
    B --> C[createRoot: Render Providers Tree]
    C --> D[Provider store={store}: Redux Provider]
    D --> E[ThemeProvider: Theme context]
    E --> F[AuthInit: Init User Session]
    F -->|dispatch initializeAuth| G{Is Loading Session?}
    G -->|Yes| H[Render Loader Spinner]
    G -->|No| I[RouterProvider router={router}]
    I --> J{Match URL Route}
    J -->|Public Route: /about| K[RootLayout: Header + Footer + Page]
    J -->|Auth Route: /auth/login| L[AuthLayout: Guest Page]
    J -->|Protected Route: /dashboard/*| M[ProtectedRoute]
    M -->|isAuthenticated = False| N[Redirect to /auth/login]
    M -->|Role mismatch| O[Redirect to /]
    M -->|Access Allowed| P[DashboardLayout: Sidebar + Header + Page]
```

### Detailed Execution Phase Description

1.  **Bootstrapping & Axios Configuration**:
    *   The browser loads [main.tsx](file:///c:/Users/anike/Videos/Hospital-Appointment/Frontend/src/main.tsx).
    *   `setupInterceptors(axiosInstance, store)` is invoked immediately. This registers a global response interceptor. If any API endpoint returns a `401 Unauthorized` status (e.g., token expired), the interceptor automatically dispatches the `logout()` action to synchronize the local state.
2.  **Context & Providers Rendering**:
    *   The App wraps itself inside the Redux [store](file:///c:/Users/anike/Videos/Hospital-Appointment/Frontend/src/app/store.ts) context `<Provider>` and the `<ThemeProvider>` for UI styling.
    *   It then mounts the `<AuthInit>` component.
3.  **Authentication Initialization (`AuthInit`)**:
    *   [AuthInit.tsx](file:///c:/Users/anike/Videos/Hospital-Appointment/Frontend/src/app/AuthInit.tsx) mounts and triggers `dispatch(initializeAuth())` on a `useEffect` hook.
    *   The `initializeAuth` async thunk makes an API call to `/api/auth/me`.
    *   *While the request is pending*, the app displays a full-screen loading spinner ("Loading session...").
    *   If successful, it populates the user state in Redux. If it fails (no token present), it sets authentication state to false and continues. The loading spinner is cleared, letting the app mount the `<RouterProvider>`.
4.  **Routing & Guarding**:
    *   `react-router-dom` matches the URL to the routes defined in [routes.tsx](file:///c:/Users/anike/Videos/Hospital-Appointment/Frontend/src/app/routes.tsx).
    *   If the user navigates to a `/dashboard/*` route, the route is guarded by `<ProtectedRoute>`.
    *   `ProtectedRoute` checks the user's role and authentication status from Redux. If the user is unauthenticated, it redirects to `/auth/login`. If the user has a mismatching role (e.g. receptionist tries to access `/dashboard/admin`), they are redirected to `/`.

---

## 3. Directory Structure & Key Entry Points

```
Frontend/src/
├── main.tsx                # Bootstrap file (Redux, Router, Interceptor Init)
├── App.tsx                 # Base Layout Template / Placeholder
├── index.css               # Global CSS & Tailwind utilities
├── app/                    # Global App Configuration
│   ├── AuthInit.tsx        # Performs check-session on bootup
│   ├── routes.tsx          # Centralized React Router definitions
│   ├── store.ts            # Centralized Redux Store Configuration
│   └── theme-provider.tsx  # Dark/Light mode theme provider
├── api/                    # HTTP Requests configuration
│   ├── axios.ts            # Base Axios Client (withCredentials: true)
│   └── interceptors.ts     # Global Interceptors (handles 401 logouts)
├── layouts/                # Wrapper Layout components
│   ├── RootLayout.tsx      # Public layout with Navbar & Footer
│   ├── AuthLayout.tsx      # Login layout (no Nav, centered panel)
│   ├── DashboardLayout.tsx # Sidebar + Header admin layout
│   └── ProtectedRoute.tsx  # Route Guarding Component
├── Features/               # Modular Feature folders (Redux + Logic)
│   ├── auth/               # Auth API calls & auth slice
│   ├── appointment/        # Appointment slice & booking logic
│   ├── doctor/             # Doctor dashboard slice & methods
│   ├── patient/            # Patient details slice & history
│   └── admin/              # Staff & Clinic management slice
└── pages/                  # Routed UI Pages
    ├── public/             # Landing pages (Home, Treatments, Doctors, Booking)
    ├── auth/               # Login & Forgot Password pages
    └── dashboard/          # Specialized Role-based Dashboards (Admin, Doctor, Patient, Reception)
```

---

## 4. Key Architectural Decisions (Why We Chose This Method)

### 1. HTTP-Only Cookie Authentication (Instead of LocalStorage JWT)
*   **The Decision**: We store the JSON Web Token (JWT) in a secure, `httpOnly`, `secure` cookie managed by the backend, rather than storing it in frontend `localStorage`.
*   **Why it's better**:
    1.  **Security**: Storing tokens in `localStorage` makes them accessible to JavaScript running on the page, exposing the application to **Cross-Site Scripting (XSS)** token theft. `httpOnly` cookies cannot be accessed via `document.cookie` in JS.
    2.  **Developer Experience**: The browser automatically attaches the cookie to all outgoing cross-origin requests to `http://localhost:5000` because `withCredentials: true` is configured in our Axios client. We do not have to write custom logic to fetch the token from storage and attach it to an `Authorization` header on every request.

### 2. React Router v6 Data Router (`createBrowserRouter`)
*   **The Decision**: We use React Router v6 Data API configuration instead of legacy inline `<Routes>` components.
*   **Why it's better**:
    1.  **Out-of-box layout nesting**: The routing is highly declarative. Utilizing `<Outlet />` inside layouts (like `RootLayout` or `DashboardLayout`) allows the shell component to remain mounted (preventing sidebar/header flashing) while replacing page-specific body content seamlessly.
    2.  **Scalable Authorization**: Rather than writing guard logic in individual pages, route protection is nested globally in [routes.tsx](file:///c:/Users/anike/Videos/Hospital-Appointment/Frontend/src/app/routes.tsx) using the `ProtectedRoute` layout wrapper.

### 3. Axios Interceptors for Decoupled Error Handling
*   **The Decision**: The frontend Axios instance applies interceptors in [interceptors.ts](file:///c:/Users/anike/Videos/Hospital-Appointment/Frontend/src/api/interceptors.ts) to globally intercept responses.
*   **Why it's better**:
    *   Instead of wrapping every single API call in component pages with custom checks for token expiration, our global interceptor handles `401 Unauthorized` responses automatically. It fires a `logout()` action to Redux, cleaning up user state and letting the `ProtectedRoute` reactively redirect the user back to the login page.

### 4. Redux Toolkit (RTK) with Feature-Based Folder Architecture
*   **The Decision**: Feature slices (`authSlice.ts`, `appointmentSlice.ts`) are stored in `src/Features/` folders alongside their respective API calls.
*   **Why it's better**:
    *   Traditional Redux setups split code by action-types, reducers, and thunks in separate folders, forcing developers to edit multiple distant files for one feature. The feature-based slice approach bundles state, synchronous reducers, and asynchronous actions (`createAsyncThunk`) into a single, cohesive file, greatly improving code discoverability and scalability.

---

## 5. Development Guide: How to Add Features

When adding new screens or functionality, follow these steps to keep the codebase clean:

### Step 1: Add or Modify the Redux Slice (if state is global)
If you are adding a new feature (e.g. "Prescriptions"):
1.  Create a folder `src/Features/prescription`.
2.  Add `prescriptionApi.ts` for Axios endpoints:
    ```typescript
    import axiosInstance from "../../api/axios";
    export const getPrescriptions = async () => {
        const response = await axiosInstance.get("/api/patient/prescriptions");
        return response.data;
    };
    ```
3.  Add `prescriptionSlice.ts` to manage loading and data state:
    ```typescript
    import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
    import { getPrescriptions } from "./prescriptionApi";

    export const fetchPrescriptions = createAsyncThunk(
        "prescription/fetchAll",
        async (_, { rejectWithValue }) => {
            try {
                return await getPrescriptions();
            } catch (err: any) {
                return rejectWithValue(err.response?.data?.message || "Failed to fetch");
            }
        }
    );

    const prescriptionSlice = createSlice({
        name: "prescription",
        initialState: { items: [], loading: false, error: null },
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(fetchPrescriptions.pending, (state) => { state.loading = true; })
                .addCase(fetchPrescriptions.fulfilled, (state, action) => {
                    state.loading = false;
                    state.items = action.payload;
                });
        }
    });
    export default prescriptionSlice.reducer;
    ```

### Step 2: Register Slice in Redux Store
Open [store.ts](file:///c:/Users/anike/Videos/Hospital-Appointment/Frontend/src/app/store.ts) and add your reducer:
```typescript
import prescriptionReducer from "../Features/prescription/prescriptionSlice";

export const store = configureStore({
    reducer: {
        // ...other reducers
        prescription: prescriptionReducer,
    }
});
```

### Step 3: Create UI Page
Create a new file in `src/pages/dashboard/patient/PatientPrescriptionsPage.tsx`. Use typed hooks (`useAppDispatch` and `useAppSelector` from `src/app/store`) to connect your component to the state:
```tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { fetchPrescriptions } from "../../../Features/prescription/prescriptionSlice";

const PatientPrescriptionsPage = () => {
    const dispatch = useAppDispatch();
    const { items, loading } = useAppSelector((state) => state.prescription);

    useEffect(() => {
        dispatch(fetchPrescriptions());
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>My Prescriptions</h1>
            {/* Render lists */}
        </div>
    );
};

export default PatientPrescriptionsPage;
```

### Step 4: Hook Up the Router
Open [routes.tsx](file:///c:/Users/anike/Videos/Hospital-Appointment/Frontend/src/app/routes.tsx) and add the path to the patient dashboard section:
```tsx
import PatientPrescriptionsPage from '../pages/dashboard/patient/PatientPrescriptionsPage'

// inside patient route children:
{ path: "prescriptions", element: <PatientPrescriptionsPage /> }
```
This route is automatically protected and rendered within the DashboardLayout!
