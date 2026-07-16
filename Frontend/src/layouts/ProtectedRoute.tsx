import { Navigate, Outlet } from "react-router-dom";

type Parameters = {
    isAuthenticated?: boolean;
    allowedRoles: string[];
    userRole?: string;
};

const ProtectedRoute = ({ isAuthenticated = false, allowedRoles, userRole }: Parameters) => {

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    if (allowedRoles &&
        userRole &&
        !allowedRoles.includes(userRole)
    ) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;