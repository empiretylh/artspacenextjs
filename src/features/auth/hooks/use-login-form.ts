"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useNotifications } from "@/components/ui/notifications";
import { paths } from "@/config/paths";
import { handleFormError } from "@/lib/utils";
import { authAnalytics } from "@/lib/analytics";
import { useAuth } from "../store";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address")
    .max(254, "Email must be less than 254 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const { login, user, loading, setLoginDialogOpen } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotifications();

  const [showPassword, setShowPassword] = useState(false);

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

      if (response === true) {
        addNotification({
          title: "Welcome Back!",
          message: "You’ve successfully signed in.",
          type: "success",
        });

        authAnalytics.login({ method: "email" });

        setLoginDialogOpen(false);
      } else {
        handleFormError(response, form);
      }
    } catch (err) {
      addNotification({
        title: "Login Failed",
        message: "Invalid email or password",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (user) {
      router.push(paths.root.path);
    }
  }, [user]);

  return {
    form,
    onSubmit,
    loading,
    showPassword,
    setShowPassword,
  };
}
