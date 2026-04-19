"use client";

import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { paths } from "@/config/paths";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

import type { LoginFormValues } from "../hooks/use-login-form";

type Props = {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (values: LoginFormValues) => Promise<void>;
  loading: boolean;
  reason?: "session_expired" | undefined;
  showPassword: boolean;
  setShowPassword: (v: boolean | ((prev: boolean) => boolean)) => void;
  handleGoogleSuccess: (credentialResponse: CredentialResponse) => Promise<void>;
};

export default function LoginFormView({
  form,
  onSubmit,
  loading,
  showPassword,
  setShowPassword,
  reason,
  handleGoogleSuccess,
}: Props) {
  return (
    <div>
      <p className="text-center text-lg font-semibold text-foreground mb-2">
        Welcome Back
      </p>
      <p className="text-center text-muted-foreground mb-6 text-sm">
        Please sign in to your account
      </p>

      {/* Session expired message (shown after redirect) */}
      {reason === "session_expired" && !form.formState.errors.root && (
        <div className="p-3 text-center border flex items-center justify-center mb-3 rounded text-sm border-info/50 text-info/70">
          Your session expired. Please sign in again to continue.
        </div>
      )}

      {/* Server / form errors */}
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
                  <Input type="email" placeholder="Email address" {...field} />
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
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center w-full overflow-hidden">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.error("Google Login Failed");
                }}
                useOneTap
                theme="outline"
                shape="rectangular"
                width="100%"
              />
            </div>

            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Link to={paths.auth.register.path}>Sign up</Link>
            </FieldDescription>
          </Field>
        </form>
      </Form>
    </div>
  );
}
