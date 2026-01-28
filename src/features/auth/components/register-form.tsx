"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   Form,
   FormField,
   FormItem,
   FormControl,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../store";
import { useNotifications } from "@/components/ui/notifications";
import { handleFormError } from "@/lib/utils";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { FieldDescription } from "@/components/ui/field";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import { useRouter } from "next/navigation";
import Image from "@/components/common/image";

const myanmarPhoneRegex = /^(?:\+?95|0)9(?:2|3|4|5|6|7|8|9)\d{7,9}$/;

// 🧠 Validation schema
const registerSchema = z
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

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterForm() {
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

   const form = useForm<RegisterForm>({
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

   const onSubmit = async (values: RegisterForm) => {
      const response = await registerUser(values);
      if (response === true) {
         addNotification({
            title: "Success",
            message: "Account created successfully. You can now sign in.",
            type: "success",
         });
         // setRegisterDialogOpen(false);
         // setLoginDialogOpen(true);
         router.push(paths.auth.login.path);
      } else {
         handleFormError(response, form);
      }
   };

   return (
      <div className="">
         <h2 className="text-center text-lg font-semibold text-foreground mb-2">
            Sign Up
         </h2>

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
                              placeholder="Email address *"
                              type="email"
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
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <Input placeholder="First Name *" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Last Name */}
               <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* User Type */}
               <FormField
                  control={form.control}
                  name="user_type"
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <Select
                              value={field.value}
                              onValueChange={field.onChange}
                           >
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Select User Type" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="BUYER">Default</SelectItem>
                                 <SelectItem value="COLLECTOR">
                                    Collector
                                 </SelectItem>
                                 <SelectItem value="GALLERY">
                                    Gallery
                                 </SelectItem>
                                 <SelectItem value="ARTIST">Artist</SelectItem>
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
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <Input placeholder="Phone *" {...field} />
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
                                 placeholder="Password *"
                                 {...field}
                                 className="pr-10"
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowPassword(!showPassword)}
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

               {/* Confirm Password */}
               <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <div className="relative">
                              <Input
                                 type={
                                    showConfirmPassword ? "text" : "password"
                                 }
                                 placeholder="Confirm Password *"
                                 {...field}
                                 className="pr-10"
                              />
                              <button
                                 type="button"
                                 onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                 }
                                 className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                              >
                                 {showConfirmPassword ? (
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

               <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Loading..." : "Sign up"}
               </Button>
               <FieldDescription className="px-6 text-center">
                  Already have an account?{" "}
                  <Link to={paths.auth.login.path}>
                     Sign in
                  </Link>
               </FieldDescription>
            </form>
         </Form>
      </div>
   );
}
