import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import LoadingPage from "@/components/page/loading-page";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
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

// import { useGetProfile } from "../api/get-profile";
import {
   updateProfileInputSchema,
   useUpdateProfile,
} from "../api/update-profile";
import { useGetProfile } from "../api/get-profile";

// 🧩 Define the type for form data
type FormData = z.infer<typeof updateProfileInputSchema>;

interface ProfileEditFormProps {
   onUpdateSuccess: () => void;
}

export default function ProfileEditForm({
   onUpdateSuccess,
}: Readonly<ProfileEditFormProps>) {
   const { addNotification } = useNotifications();

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
      },
   });

   // Update mutation
   const updateProfileMutation = useUpdateProfile({
      mutationConfig: {
         onError: (error) => handleFormError(error, form),
         onSuccess: () => {
            addNotification({
               type: "success",
               title: "Success",
               message: "Profile updated successfully",
            });
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
            <Card>
               <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                     Update your personal details and profile information.
                  </CardDescription>
               </CardHeader>

               <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Enter first name"
                                    {...field}
                                 />
                              </FormControl>
                              <FormDescription>
                                 Your given name.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Enter last name"
                                    {...field}
                                 />
                              </FormControl>
                              <FormDescription>
                                 Your family name.
                              </FormDescription>
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
                           <FormLabel>Bio</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Tell something about yourself..."
                                 className="min-h-32 resize-y"
                                 {...field}
                              />
                           </FormControl>
                           <FormDescription>
                              A short description about who you are.
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
                           <FormLabel>Website</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="https://yourwebsite.com"
                                 {...field}
                              />
                           </FormControl>
                           <FormDescription>
                              Optional — your personal or business site.
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </CardContent>

               <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline">
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     disabled={updateProfileMutation.isPending}
                  >
                     Update Profile
                  </Button>
               </CardFooter>
            </Card>
         </form>
      </Form>
   );
}
