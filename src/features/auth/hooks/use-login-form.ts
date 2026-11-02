"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useNotifications } from "@/components/ui/notifications";
import { paths } from "@/config/paths";
import { handleFormError } from "@/lib/utils";
import { accessAnalytics, authAnalytics, UserType } from "@/lib/analytics";
import { useAuth } from "../store";
import { User } from "@/types";
import { switchAccountType, type SwitchableAccountType } from "@/features/settings/api/switch-account-type";
import { useSyncUserProfile } from "@/features/chat/hooks/use-sync-user-profile";
import type { AppleNativeCredential } from "../lib/native-apple-auth";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address")
    .max(254, "Email must be less than 254 characters"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLoginForm({ returnTo }: { returnTo?: string } = {}) {
  const { login, loginWithGoogle, loginWithApple, loading } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotifications();
  const { syncProfile } = useSyncUserProfile();

  const [showPassword, setShowPassword] = useState(false);
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

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login(values.email, values.password);

      if (!(response instanceof Error) && response) {
        addNotification({
          title: "Welcome Back!",
          message: "You’ve successfully signed in.",
          type: "success",
        });

        authAnalytics.login({ method: "email" });

        const { id, user_type } = response as User;
        accessAnalytics.setUser(String(id), user_type.toLocaleLowerCase() as UserType);

        if (returnTo) {
          router.push(returnTo);
        } else {
          router.push(paths.root.path);
        }
      } else {
        handleFormError(response, form);
      }
    } catch (err) {
      handleFormError(err, form);
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    if (!idToken) return;

    try {
      const response = await loginWithGoogle(idToken);

      if (!(response instanceof Error) && response) {
        addNotification({
          title: "Welcome Back!",
          message: "You’ve successfully signed in with Google.",
          type: "success",
        });

        authAnalytics.login({ method: "google" });

        const { id, user_type } = response as User;
        accessAnalytics.setUser(String(id), user_type.toLocaleLowerCase() as UserType);

        const hasCompletedOnboarding = typeof window !== "undefined" && localStorage.getItem(`artspace_role_onboarding_${id}`);
        if ((!user_type || user_type === "BUYER") && !hasCompletedOnboarding) {
          setOnboardingUser(response as User);
          return;
        }

        if (returnTo) {
          router.push(returnTo);
        } else {
          router.push(paths.root.path);
        }
      } else {
         addNotification({
          title: "Login Failed",
          message: "Could not authenticate with Google",
          type: "error",
        });
      }
    } catch (err) {
      addNotification({
        title: "Login Failed",
        message: "An unexpected error occurred during Google sign-in",
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
        if (returnTo) {
          router.push(returnTo);
        } else {
          router.push(paths.root.path);
        }
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
          title: "Welcome Back!",
          message: "You’ve successfully signed in with Apple.",
          type: "success",
        });

        authAnalytics.login({ method: "apple" });

        const { id, user_type } = response as User;
        accessAnalytics.setUser(String(id), user_type.toLocaleLowerCase() as UserType);

        if (returnTo) {
          router.push(returnTo);
        } else {
          router.push(paths.root.path);
        }
      } else {
        addNotification({
          title: "Login Failed",
          message: "Could not authenticate with Apple",
          type: "error",
        });
      }
    } catch (err) {
      addNotification({
        title: "Login Failed",
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
      if (returnTo) {
        router.push(returnTo);
      } else {
        router.push(paths.root.path);
      }
    }, 500);
  };
  return {
    form,
    onSubmit,
    handleGoogleSuccess,
    handleAppleSuccess,
    loading,
    showPassword,
    setShowPassword,
    onboardingUser,
    handleRoleSelect,
    handleRoleSkip,
    isSwitchingRole,
    isRedirecting,
    triggerMockOnboarding,
  };
}
