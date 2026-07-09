import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
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
import { handleFormError } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";

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
      },
   });

   // Update mutation
   const updateProfileMutation = useUpdateProfile({
      mutationConfig: {
         onError: (error) => handleFormError(error, form),
         onSuccess: () => {
            addNotification({
               type: "success",
               title: t("success"),
               message: t("profileUpdated"),
            });
            userAnalytics.edit(String(profile?.id), 'settings_page');
            onUpdateSuccess();
            form.reset();
         },
      },
   });

   if (profileQuery.isLoading) {
      return <LoadingPage />;
   }

   //  if (!profile) {
   //     return null;
   //  }

   // Submit handler
   const onSubmit: SubmitHandler<FormData> = (values) => {
      updateProfileMutation.mutate({ data: values });
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>{t("firstName")}</FormLabel>
                        <FormControl>
                           <Input placeholder={t("enterFirstName")} {...field} />
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
                           <Input placeholder={t("enterLastName")} {...field} />
                        </FormControl>
                        <FormDescription>{t("lastNameDesc")}</FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <FormField
               control={form.control}
               name="bio"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>{t("bio")}</FormLabel>
                     <FormControl>
                        <Textarea
                           placeholder={t("bioPlaceholder")}
                           className="min-h-32 resize-y"
                           {...field}
                        />
                     </FormControl>
                     <FormDescription>
                        {t("bioDesc")}
                     </FormDescription>
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
                     <FormDescription>
                        {t("aboutDesc")}
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="website"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>{t("website")}</FormLabel>
                     <FormControl>
                        <Input
                           placeholder="https://yourwebsite.com"
                           {...field}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="show_email"
               render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                     <div className="space-y-0.5">
                        <FormLabel>{t("showEmail")}</FormLabel>
                        <FormDescription>
                           {t("showEmailDesc")}
                        </FormDescription>
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
            <div className="border-t py-4 space-x-2">
               <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {t("save")}
               </Button>
               <Button type="button" variant="outline">
                  {t("cancel")}
               </Button>
            </div>
         </form>
      </Form>
   );
}
