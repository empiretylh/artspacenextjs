"use client";

import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

import { paths } from "@/config/paths";
import type { RegisterFormValues } from "../hooks/use-register-form";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

type Props = {
  form: UseFormReturn<RegisterFormValues>;
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  loading: boolean;

  showPassword: boolean;
  setShowPassword: (v: boolean) => void;

  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: boolean) => void;
  handleGoogleSuccess: (credentialResponse: CredentialResponse) => Promise<void>;
};

export default function RegisterFormView({
  form,
  onSubmit,
  loading,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  handleGoogleSuccess,
}: Props) {
  const t = useTranslations("Auth.register");

  return (
    <div className="">
      <h1 className="text-center text-xl font-bold font-display text-foreground mb-2">
        {t("joinTitle")}
      </h1>
      <p className="text-center text-muted-foreground mb-6 text-sm">
        {t("subtitle")}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="on"
          noValidate
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t("emailLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("emailPlaceholder")}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label="Email address"
                    aria-invalid={!!fieldState.error}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* First Name */}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t("firstNameLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("firstNamePlaceholder")}
                    autoComplete="given-name"
                    aria-label="First name"
                    aria-invalid={!!fieldState.error}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="last_name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t("lastNameLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("lastNamePlaceholder")}
                    autoComplete="family-name"
                    aria-label="Last name"
                    aria-invalid={!!fieldState.error}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* User Type */}
          <FormField
            control={form.control}
            name="user_type"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t("accountTypeLabel")}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full"
                      aria-label="User type"
                      aria-invalid={!!fieldState.error}
                    >
                      <SelectValue placeholder={t("selectAccountType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUYER">{t("defaultAccount")}</SelectItem>
                      <SelectItem value="COLLECTOR">{t("collector")}</SelectItem>
                      <SelectItem value="GALLERY">{t("gallery")}</SelectItem>
                      <SelectItem value="ARTIST">{t("artist")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t("phoneLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("phonePlaceholder")}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    aria-label="Phone number"
                    aria-invalid={!!fieldState.error}
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
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t("passwordLabel")}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      title={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      aria-label="Password"
                      aria-invalid={!!fieldState.error}
                      {...field}
                      className="pr-10"
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t("confirmPasswordLabel")}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      aria-label="Confirm password"
                      aria-invalid={!!fieldState.error}
                      {...field}
                      className="pr-10"
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    aria-pressed={showConfirmPassword}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? t("loading") : t("signUp")}
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
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.error("Google Registration Failed");
              }}
              useOneTap
              theme="outline"
              shape="rectangular"
              width="100%"
            />
          </div>

          <FieldDescription className="px-6 text-center">
            {t("alreadyHaveAccount")}{" "}
            <Link to={paths.auth.login.path}>{t("signIn")}</Link>
          </FieldDescription>
        </form>
      </Form>
    </div>
  );
}
