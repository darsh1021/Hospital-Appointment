import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store";
import { initializeAuth } from "../Features/auth/authSlice";

export const AuthInit = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(initializeAuth());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a]">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="size-6 animate-spin rounded-full border-2 border-current border-t-transparent text-[#171717] dark:text-white" />
                    <p className="text-[14px] text-[#888888]">Loading session...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

