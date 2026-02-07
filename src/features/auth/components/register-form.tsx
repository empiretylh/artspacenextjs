"use client";

import { useRegisterForm } from "../hooks/use-register-form";
import RegisterFormView from "./register-form-view";

export default function RegisterForm() {
   const vm = useRegisterForm();

   return (
      <RegisterFormView
         form={vm.form}
         onSubmit={vm.onSubmit}
         loading={vm.loading}
         showPassword={vm.showPassword}
         setShowPassword={vm.setShowPassword}
         showConfirmPassword={vm.showConfirmPassword}
         setShowConfirmPassword={vm.setShowConfirmPassword}
      />
   );
}
