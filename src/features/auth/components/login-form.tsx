"use client";

import { useLoginForm } from "../hooks/use-login-form";
import LoginFormView from "./login-form-view";

export default function LoginForm() {
   const vm = useLoginForm();

   return (
      <LoginFormView
         form={vm.form}
         onSubmit={vm.onSubmit}
         loading={vm.loading}
         showPassword={vm.showPassword}
         setShowPassword={vm.setShowPassword}
      />
   );
}
