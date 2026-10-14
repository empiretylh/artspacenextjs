import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import LoadingPage from "@/components/page/loading-page";
import { Button } from "@/components/ui/button";


import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNotifications } from "@/components/ui/notifications";
import { getDirtyValues, handleFormError } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { EyeOff, Globe, Lock, Mail, Shield, Sparkles } from "lucide-react";

// import { useGetProfile } from "../api/get-profile";
import {
   updateProfileInputSchema,
   useUpdateProfile,
} from "../api/update-profile";
import { useGetProfile } from "../api/get-profile";
import { userAnalytics } from "@/lib/analytics";

// 🧩 Define the type for form data
type FormData = z.infer<typeof updateProfileInputSchema>;

interface ProfileEditFormProps {
   onUpdateSuccess: () => void;
}

export default function ProfileEditForm({
   onUpdateSuccess,
}: Readonly<ProfileEditFormProps>) {
   const { addNotification } = useNotifications();
   const t = useTranslations("Settings");

   // Fetch profile data
   const profileQuery = useGetProfile();
   const profile = profileQuery?.data?.data ?? null;

   // Setup form with Zod + RHF
   const form = useForm<FormData>({
      resolver: zodResolver(updateProfileInputSchema),
      values: {
         first_name: profile?.first_name ?? "",
         last_name: profile?.last_name ?? "",
         bio: profile?.profile?.bio ?? "",
         website: profile?.profile?.website ?? "",
         about: profile?.profile?.about ?? "",
         show_email: profile?.profile?.show_email ?? false,
         hide_collector_name: (profile as unknown as { hide_collector_name?: boolean })?.hide_collector_name ?? profile?.profile?.hide_collector_name ?? false,
      },
   });

   const hideCollectorName = useWatch({
      control: form.control,
      name: "hide_collector_name",
   });
   const bioValue = useWatch({
      control: form.control,
      name: "bio",
   });

   // Update mutation
   const updateProfileMutation = useUpdateProfile({
      mutationConfig: {
         onError: (error) => handleFormError(error, form),
         onSuccess: (response) => {
            addNotification({
               type: "success",
               title: t("success"),
               message: t("profileUpdated"),
            });
            userAnalytics.edit(String(profile?.id), 'settings_page');
            onUpdateSuccess();
            const updatedUser = response.data;
            form.reset({
               first_name: updatedUser.first_name ?? "",
               last_name: updatedUser.last_name ?? "",
               bio: updatedUser.profile?.bio ?? "",
               website: updatedUser.profile?.website ?? "",
               about: updatedUser.profile?.about ?? "",
               show_email: updatedUser.profile?.show_email ?? false,
               hide_collector_name:
                  (updatedUser as unknown as { hide_collector_name?: boolean })?.hide_collector_name ??
                  updatedUser.profile?.hide_collector_name ??
                  false,
            });
         },
      },
   });

   if (profileQuery.isLoading) {
      return <LoadingPage />;
   }

   //  if (!profile) {
   //     return null;
   //  }

   const isHideCollectorName =
      profile?.user_type === "COLLECTOR" && Boolean(hideCollectorName);

   const onSubmit: SubmitHandler<FormData> = (values) => {
      const dirtyValues = getDirtyValues<FormData>(
         form.formState.dirtyFields,
         values
      );

      if (isHideCollectorName) {
         delete dirtyValues.first_name;
         delete dirtyValues.last_name;
      }

      if (Object.keys(dirtyValues).length === 0) {
         onUpdateSuccess();
         return;
      }

      updateProfileMutation.mutate({ data: dirtyValues });
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Section 1: Public Profile Information */}
            <div className="space-y-4">

               {isHideCollectorName && (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/60 border border-border/60 text-xs text-muted-foreground">
                     <Lock className="w-4 h-4 text-primary shrink-0" />
                     <span>First and last name are locked while &quot;Hide Collector Name&quot; is enabled.</span>
                  </div>
               )}

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                     control={form.control}
                     name="first_name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>{t("firstName")}</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder={t("enterFirstName")}
                                 {...field}
                                 disabled={isHideCollectorName}
                              />
                           </FormControl>
                           <FormDescription>{t("firstNameDesc")}</FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="last_name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>{t("lastName")}</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder={t("enterLastName")}
                                 {...field}
                                 disabled={isHideCollectorName}
                              />
                           </FormControl>
                           <FormDescription>{t("lastNameDesc")}</FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
            </div>

            {/* Section 2: Biography & Story */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 border-b border-border/60 pb-2.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                     {t("bio")} &amp; {t("about")}
                  </h3>
               </div>

               <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                     <FormItem>
                        <div className="flex items-center justify-between">
                           <FormLabel>{t("bio")}</FormLabel>
                           <span className="text-xs text-muted-foreground">
                              {(bioValue || "").length}/150
                           </span>
                        </div>
                        <FormControl>
                           <Textarea
                              placeholder={t("bioPlaceholder")}
                              className="min-h-24 resize-y"
                              maxLength={150}
                              {...field}
                           />
                        </FormControl>
                        <FormDescription>{t("bioDesc")}</FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>{t("about")}</FormLabel>
                        <FormControl>
                           <Textarea
                              placeholder={t("aboutPlaceholder")}
                              className="min-h-32 resize-y"
                              {...field}
                           />
                        </FormControl>
                        <FormDescription>{t("aboutDesc")}</FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            {/* Section 3: Online Presence */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 border-b border-border/60 pb-2.5">
                  <Globe className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                     {t("website")}
                  </h3>
               </div>

               <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>{t("website")}</FormLabel>
                        <div className="relative">
                           <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                           <FormControl>
                              <Input
                                 placeholder="https://yourwebsite.com"
                                 className="pl-9"
                                 {...field}
                              />
                           </FormControl>
                        </div>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            {/* Section 4: Privacy & Visibility */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 border-b border-border/60 pb-2.5">
                  <Shield className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                     {t("privacySafety")}
                  </h3>
               </div>

               <div className="grid grid-cols-1 gap-3.5">
                  <FormField
                     control={form.control}
                     name="show_email"
                     render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border/70 p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                           <div className="flex items-start gap-3 space-y-0">
                              <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                                 <Mail className="w-4 h-4" />
                              </div>
                              <div className="space-y-0.5">
                                 <FormLabel className="font-medium text-foreground cursor-pointer">
                                    {t("showEmail")}
                                 </FormLabel>
                                 <FormDescription className="text-xs">
                                    {t("showEmailDesc")}
                                 </FormDescription>
                              </div>
                           </div>
                           <FormControl>
                              <Switch
                                 checked={field.value}
                                 onCheckedChange={field.onChange}
                              />
                           </FormControl>
                        </FormItem>
                     )}
                  />

                  {profile?.user_type === "COLLECTOR" && (
                     <FormField
                        control={form.control}
                        name="hide_collector_name"
                        render={({ field }) => (
                           <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border/70 p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                              <div className="flex items-start gap-3 space-y-0">
                                 <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                                    <EyeOff className="w-4 h-4" />
                                 </div>
                                 <div className="space-y-0.5">
                                    <FormLabel className="font-medium text-foreground cursor-pointer">
                                       {t("hideCollectorName")}
                                    </FormLabel>
                                    <FormDescription className="text-xs">
                                       {t("hideCollectorNameDesc")}
                                    </FormDescription>
                                 </div>
                              </div>
                              <FormControl>
                                 <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                 />
                              </FormControl>
                           </FormItem>
                        )}
                     />
                  )}
               </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60 pt-5">
               <div className="text-xs text-muted-foreground self-start sm:self-center">
                  {form.formState.isDirty ? (
                     <span className="text-amber-500 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        Unsaved changes
                     </span>
                  ) : (
                     <span>All changes saved</span>
                  )}
               </div>
               <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <Button
                     type="button"
                     variant="outline"
                     size="sm"
                     disabled={!form.formState.isDirty || updateProfileMutation.isPending}
                     onClick={() => form.reset()}
                  >
                     {t("cancel")}
                  </Button>
                  <Button
                     type="submit"
                     size="sm"
                     loading={updateProfileMutation.isPending}
                     disabled={!form.formState.isDirty || updateProfileMutation.isPending}
                     className="px-6"
                  >
                     {t("save")}
                  </Button>
               </div>
            </div>
         </form>
      </Form>
   );
}
