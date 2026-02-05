"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useNotifications } from "@/components/ui/notifications";
import { paths } from "@/config/paths";
import { handleFormError } from "@/lib/utils";
import { authAnalytics } from "@/lib/analytics";
import { useAuth } from "../store";

const myanmarPhoneRegex = /^(?:\+?95|0)9(?:2|3|4|5|6|7|8|9)\d{7,9}$/;

// 🧠 Validation schema (unchanged)
export const registerSchema = z
  .object({
    email: z
      .string()
      .email("Enter a valid email address")
      .max(254, "Email must be less than 254 characters"),

    password: z.string().min(6, "Password must be at least 6 characters"),

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
    loading,
    setRegisterDialogOpen,
    setLoginDialogOpen,
  } = useAuth();

  const { addNotification } = useNotifications();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      // setRegisterDialogOpen(false);
      // setLoginDialogOpen(true);

      router.push(paths.auth.login.path);
    } else {
      handleFormError(response, form);
    }
  };

  return {
    // form + submit
    form,
    onSubmit,

    // state
    loading,
    showPassword,
    showConfirmPassword,

    // actions
    setShowPassword,
    setShowConfirmPassword,

    // kept available (even if currently commented usage)
    setRegisterDialogOpen,
    setLoginDialogOpen,
  };
}
