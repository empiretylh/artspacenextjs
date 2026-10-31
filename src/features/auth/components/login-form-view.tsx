"use client";

import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { paths } from "@/config/paths";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

import type { LoginFormValues } from "../hooks/use-login-form";
import GoogleAuthButton from "./google-auth-button";

type Props = {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (values: LoginFormValues) => Promise<void>;
  loading: boolean;
  reason?: "session_expired" | undefined;
  showPassword: boolean;
  setShowPassword: (v: boolean | ((prev: boolean) => boolean)) => void;
  handleGoogleSuccess: (idToken: string) => Promise<void>;
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
  const t = useTranslations("Auth.login");

  return (
    <div>
      <h1 className="text-center text-xl font-bold font-display text-foreground mb-2">
        {t("welcomeBack")}
      </h1>
      <p className="text-center text-muted-foreground mb-6 text-sm">
        {t("subtitle")}
      </p>

      {/* Session expired message (shown after redirect) */}
      {reason === "session_expired" && !form.formState.errors.root && (
        <div className="p-3 text-center border flex items-center justify-center mb-3 rounded text-sm border-info/50 text-info/70">
          {t("sessionExpired")}
        </div>
      )}

      {/* Server / form errors */}
      {form.formState.errors.root && (
        <div className="text-destructive p-3 text-center border flex items-center justify-center mb-3 rounded border-destructive text-sm">
          {form.formState.errors.root.message}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t("emailLabel")}</FormLabel>
                <FormControl>
                  <Input type="email" aria-label="Email address" placeholder={t("emailPlaceholder")} {...field} />
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
                <FormLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t("passwordLabel")}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      aria-label="Password"
                      placeholder="••••••••"
                      {...field}
                      className="pr-10"
                    />
                  </FormControl>
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Field>
            <Button
              type="submit"
              className="w-full mt-2"
              disabled={loading || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? t("signingIn") : t("signIn")}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("orContinue")}
                </span>
              </div>
            </div>

          <div className="flex justify-center w-full overflow-hidden">
            <GoogleAuthButton
              onIdToken={handleGoogleSuccess}
              onError={() => {
                console.error("Google Login Failed");
              }}
              label="Continue with Google"
            />
          </div>

            <FieldDescription className="text-center">
              {t("dontHaveAccount")}{" "}
              <Link to={paths.auth.register.path}>{t("signUp")}</Link>
            </FieldDescription>
          </Field>
        </form>
      </Form>
    </div>
  );
}
