"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "../store";
import { paths } from "@/config/paths";
import { useNotifications } from "@/components/ui/notifications";
import { handleFormError } from "@/lib/utils";

import {
   Form,
   FormField,
   FormItem,
   FormControl,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription } from "@/components/ui/field";
import Link from "@/components/common/link";

// 🧠 Validation schema
const loginSchema = z.object({
   email: z
      .string()
      .email("Enter a valid email address")
      .max(254, "Email must be less than 254 characters"),
   password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginForm() {
   const { login, user, loading, setLoginDialogOpen } = useAuth();
   const router = useRouter();
   const { addNotification } = useNotifications();

   const [showPassword, setShowPassword] = useState(false);

   const form = useForm<LoginForm>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const onSubmit = async (values: LoginForm) => {
      try {
         const response = await login(values.email, values.password);
         if (response === true) {
            addNotification({
               title: "Welcome Back!",
               message: "You’ve successfully signed in.",
               type: "success",
            });
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

   if (loading) {
      return <p className="text-center mt-8 text-gray-600">Loading...</p>;
   }

   return (
      <div>
         <p className="text-center text-lg font-semibold text-foreground mb-2">
            Welcome Back
         </p>
         <p className="text-center text-muted-foreground mb-6 text-sm">
            Please sign in to your account
         </p>
         {form.formState.errors.root && (
            <div className="text-destructive p-3 text-center border flex items-center justify-center mb-3 rounded border-destructive text-sm">
               {form.formState.errors.root.message}
            </div>
         )}

         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               {/* Email */}
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <Input
                              type="email"
                              placeholder="Email address"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Password */}
               <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <div className="relative">
                              <Input
                                 type={showPassword ? "text" : "password"}
                                 placeholder="Password"
                                 {...field}
                                 className="pr-10"
                              />
                              <button
                                 type="button"
                                 onClick={() =>
                                    setShowPassword((prev) => !prev)
                                 }
                                 className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                              >
                                 {showPassword ? (
                                    <EyeOff size={18} />
                                 ) : (
                                    <Eye size={18} />
                                 )}
                              </button>
                           </div>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <Field>
                  <Button
                     type="submit"
                     className="w-full"
                     disabled={loading || form.formState.isSubmitting}
                  >
                     {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                  <FieldDescription className="text-center">
                     Don&apos;t have an account?{" "}
                     <Link to={paths.auth.register.path}>
                        Sign up
                     </Link>
                  </FieldDescription>
               </Field>
            </form>
         </Form>
      </div>
   );
}
