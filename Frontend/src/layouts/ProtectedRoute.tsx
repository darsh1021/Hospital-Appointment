import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// type Parameters = {
//     isAuthenticated?: boolean;
//     allowedRoles: string[];
//     userRole?: string;
// };

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    if (allowedRoles.length > 0 &&
        user.role &&
        !allowedRoles.includes(user.role)
    ) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;