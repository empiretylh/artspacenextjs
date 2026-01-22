import { useAuth } from "@/features/auth/store";
import React from "react";
import { Outlet, useNavigate } from "react-router";
import LoadingPage from "../page/loading-page";
import { paths } from "@/config/paths";

const AuthCheck = () => {
   const { user } = useAuth();
   const router = useRouter();

   if (!user) {
      router.push(paths.auth.login.path);
   }

   if (user) {
      return <Outlet />;
   } else {
      return <LoadingPage />;
   }
};

export default AuthCheck;
