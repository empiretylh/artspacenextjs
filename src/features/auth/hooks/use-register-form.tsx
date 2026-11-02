"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useNotifications } from "@/components/ui/notifications";
import { paths } from "@/config/paths";
import { handleFormError } from "@/lib/utils";
import { authAnalytics, accessAnalytics, UserType } from "@/lib/analytics";
import { useAuth } from "../store";
import type { User } from "@/types";
import { switchAccountType, type SwitchableAccountType } from "@/features/settings/api/switch-account-type";
import { useSyncUserProfile } from "@/features/chat/hooks/use-sync-user-profile";
import type { AppleNativeCredential } from "../lib/native-apple-auth";

const myanmarPhoneRegex = /^(?:\+?95|0)9(?:2|3|4|5|6|7|8|9)\d{6,8}$/;

// 🧠 Validation schema (unchanged)
export const registerSchema = z
  .object({
    email: z
      .string()
      .email("Enter a valid email address")
      .max(254, "Email must be less than 254 characters"),

    password: z.string().min(5, "Password must be at least 5 characters"),

    password_confirmation: z.string(),

    first_name: z.string().max(150, "First name too long").min(1, "Required"),

    last_name: z.string().max(150, "Last name too long").optional(),

    user_type: z.enum(["BUYER", "COLLECTOR", "ARTIST", "GALLERY"]),

    phone: z
      .string()
      .refine(
        (val) => !val || myanmarPhoneRegex.test(val),
        "Enter a valid Myanmar phone number"
      ),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export function useRegisterForm() {
  const {
    register: registerUser,
    loginWithGoogle,
    loginWithApple,
    loading,
    setRegisterDialogOpen,
    setLoginDialogOpen,
  } = useAuth();

  const { addNotification } = useNotifications();
  const router = useRouter();
  const { syncProfile } = useSyncUserProfile();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [onboardingUser, setOnboardingUser] = useState<User | null>(null);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const triggerMockOnboarding = () => {
    setOnboardingUser({
      id: 999999,
      email: "mock.tester@example.com",
      first_name: "Mock",
      last_name: "Tester",
      user_type: "BUYER",
      profile: {
        profile_picture: null,
      },
    } as any);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
      (window as any).__testRoleModal = triggerMockOnboarding;
      (window as any).__resetRoleOnboarding = () => {
        const u = useAuth.getState().user;
        if (u?.id) {
          localStorage.removeItem(`artspace_role_onboarding_${u.id}`);
          console.log(`Cleared onboarding flag for user ${u.id}`);
        }
      };

      const isTestParam =
        window.location.hash.includes("testRoleModal=true") ||
        window.location.search.includes("testRoleModal=true");
      if (isTestParam && !onboardingUser) {
        triggerMockOnboarding();
      }
    }
  }, []);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
      first_name: "",
      last_name: "",
      phone: "",
      user_type: "BUYER",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    const response = await registerUser(values);

    if (response === true) {
      addNotification({
        title: "Success",
        message: "Account created successfully. You can now sign in.",
        type: "success",
      });

      authAnalytics.signUp({ method: "email" });

      router.push(paths.auth.login.path);
    } else {
      handleFormError(response, form, {
        fallbackTitle: "Registration Failed",
        fallbackMessage: "Failed to create account. Please check your information and try again.",
        showNotification: true,
      });
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    if (!idToken) return;

    try {
      const response = await loginWithGoogle(idToken);

      if (!(response instanceof Error) && response) {
        addNotification({
          title: "Welcome!",
          message: "You’ve successfully signed in with Google.",
          type: "success",
        });

        authAnalytics.signUp({ method: "google" });

        const { id, user_type } = response as User;
        accessAnalytics.setUser(String(id), user_type.toLocaleLowerCase() as UserType);

        const hasCompletedOnboarding = typeof window !== "undefined" && localStorage.getItem(`artspace_role_onboarding_${id}`);
        if ((!user_type || user_type === "BUYER") && !hasCompletedOnboarding) {
          setOnboardingUser(response as User);
          return;
        }

        router.push(paths.root.path);
      } else {
        addNotification({
          title: "Sign Up Failed",
          message: "Could not authenticate with Google",
          type: "error",
        });
      }
    } catch (err) {
      addNotification({
        title: "Sign Up Failed",
        message: "An unexpected error occurred during Google sign-up",
        type: "error",
      });
    }
  };

  const handleRoleSelect = async (selectedType: SwitchableAccountType) => {
    if (!onboardingUser) return;
    try {
      setIsSwitchingRole(true);

      if (onboardingUser.id === 999999) {
        // Mock network delay to demonstrate loading indicator & transitions without backend API requirement
        await new Promise((resolve) => setTimeout(resolve, 1100));
      } else {
        const res = await switchAccountType({ data: { user_type: selectedType } });
        if (res.data.user) {
          useAuth.getState().updateUser(res.data.user);
          syncProfile(true, res.data.user);
        }
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(`artspace_role_onboarding_${onboardingUser.id}`, "true");
      }
      setIsSwitchingRole(false);
      setIsRedirecting(true);

      addNotification({
        title: "Account Ready!",
        message: `Account type set to ${selectedType}`,
        type: "success",
      });

      // Allow user to see loading / redirecting feedback before navigation
      setTimeout(() => {
        router.push(paths.root.path);
      }, 700);
    } catch (err: any) {
      setIsSwitchingRole(false);
      setIsRedirecting(false);
      addNotification({
        title: "Role Selection Error",
        message: err.response?.data?.user_type?.[0] || err.message || "Failed to update role.",
        type: "error",
      });
    }
  };

  const handleAppleSuccess = async (credential: AppleNativeCredential) => {
    try {
      const response = await loginWithApple(credential);

      if (!(response instanceof Error) && response) {
        addNotification({
          title: "Welcome!",
          message: "You’ve successfully signed in with Apple.",
          type: "success",
        });

        authAnalytics.signUp({ method: "apple" });

        const { id, user_type } = response as User;
        accessAnalytics.setUser(String(id), user_type.toLocaleLowerCase() as UserType);

        router.push(paths.root.path);
      } else {
        addNotification({
          title: "Sign Up Failed",
          message: "Could not authenticate with Apple",
          type: "error",
        });
      }
    } catch (err) {
      addNotification({
        title: "Sign Up Failed",
        message: "An unexpected error occurred during Apple sign-in",
        type: "error",
      });
    }
  };

  const handleRoleSkip = () => {
    if (onboardingUser && typeof window !== "undefined") {
      localStorage.setItem(`artspace_role_onboarding_${onboardingUser.id}`, "true");
    }
    setIsRedirecting(true);
    setTimeout(() => {
      router.push(paths.root.path);
    }, 500);
  };
  return {
    // form + submit
    form,
    onSubmit,
    handleGoogleSuccess,
    handleAppleSuccess,

    // state
    loading,
    showPassword,
    showConfirmPassword,
    onboardingUser,
    isSwitchingRole,
    isRedirecting,

    // actions
    setShowPassword,
    setShowConfirmPassword,
    handleRoleSelect,
    handleRoleSkip,
    triggerMockOnboarding,

    // kept available
    setRegisterDialogOpen,
    setLoginDialogOpen,
  };
}
