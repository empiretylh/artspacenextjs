"use client";

import { useRegisterForm } from "../hooks/use-register-form";
import RegisterFormView from "./register-form-view";

export default function RegisterForm() {
   const vm = useRegisterForm();

   return (
      <RegisterFormView
         form={vm.form}
         onSubmit={vm.onSubmit}
         handleGoogleSuccess={vm.handleGoogleSuccess}
         handleAppleSuccess={vm.handleAppleSuccess}
         loading={vm.loading}
         showPassword={vm.showPassword}
         setShowPassword={vm.setShowPassword}
         showConfirmPassword={vm.showConfirmPassword}
         setShowConfirmPassword={vm.setShowConfirmPassword}
         onboardingUser={vm.onboardingUser}
         handleRoleSelect={vm.handleRoleSelect}
         handleRoleSkip={vm.handleRoleSkip}
         isSwitchingRole={vm.isSwitchingRole}
         isRedirecting={vm.isRedirecting}
         triggerMockOnboarding={vm.triggerMockOnboarding}
      />
   );
}
