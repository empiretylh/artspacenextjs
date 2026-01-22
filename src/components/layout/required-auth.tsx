import { paths } from "@/config/paths";
import { useAuth } from "@/features/auth/store";
import React from "react";
import { Navigate, Outlet } from "react-router";

export const RequireAuth: React.FC = () => {
   const { user, loading } = useAuth();
   if (loading) return <div>Loading...</div>;
   if (!user) return <Navigate to={paths.auth.login.path} replace />;
   return <Outlet />;
};
