"use client";

import { useSearchParams } from "next/navigation";
import { useLoginForm } from "../hooks/use-login-form";
import LoginFormView from "./login-form-view";

export default function LoginForm() {
   const searchParams = useSearchParams() as any;
   const returnTo = searchParams.get("return");
   const vm = useLoginForm({ returnTo });

   return (
      <LoginFormView
         reason={searchParams.get('reason')}
         form={vm.form}
         onSubmit={vm.onSubmit}
         handleGoogleSuccess={vm.handleGoogleSuccess}
         loading={vm.loading}
         showPassword={vm.showPassword}
         setShowPassword={vm.setShowPassword}
      />
   );
}
