"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useNotifications } from "@/components/ui/notifications";
import { paths } from "@/config/paths";
import { handleFormError } from "@/lib/utils";
import { accessAnalytics, authAnalytics, UserType } from "@/lib/analytics";
import { useAuth } from "../store";
import { User } from "@/types";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address")
    .max(254, "Email must be less than 254 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLoginForm({ returnTo }: { returnTo?: string } = {}) {
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

      if (response) {
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
      addNotification({
        title: "Login Failed",
        message: "Invalid email or password",
        type: "error",
      });
    }
  };

  return {
    form,
    onSubmit,
    loading,
    showPassword,
    setShowPassword,
  };
}
