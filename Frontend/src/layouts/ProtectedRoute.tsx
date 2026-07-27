import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/store";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a]">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="size-6 animate-spin rounded-full border-2 border-current border-t-transparent text-[#171717] dark:text-white" />
                    <p className="text-[14px] text-[#888888]">Checking access...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    if (
        allowedRoles.length > 0 &&
        user?.role &&
        !allowedRoles.includes(user.role)
    ) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;