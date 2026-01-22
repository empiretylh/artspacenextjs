import { z } from "zod";

export const nameSchema = z
   .string()
   .min(1, { message: "Name field cannot be empty." }) // Require field
   .refine((value) => /^[A-Za-z ]+$/.test(value), {
      message:
         "Name can only contain letters and spaces. Special characters and numbers are not allowed.",
   })
   .refine((value) => !/[0-9]/.test(value), {
      message: "Name cannot contain numbers.",
   });

export const emailSchema = z
   .string()
   .min(1, { message: "Email field cannot be empty." })
   .min(4, {
      message:
         "Email address is too short to be valid. Minimum length is 4 letters.",
   })
   .max(60, {
      message:
         "Email exceeds the maximum character limit. Maximum length is 60 characters.",
   })
   .email({ message: "Invalid email format. Check for typos." })
   .refine((value) => !/\s/.test(value), {
      message: "Email cannot contain spaces. Remove any spaces and try again.",
   });

export const passwordRequirements = [
   { regex: /.{8,}/, text: "At least 8 characters" },
   { regex: /[0-9]/, text: "At least 1 number" },
   { regex: /[a-z]/, text: "At least 1 lowercase letter" },
   { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
   { regex: /[!@#%^&*]/, text: "At least 1 special character (@!#%^&*)" },
];

export const passwordSchema = z.string().refine(
   (value) => {
      return passwordRequirements.every(({ regex }) => regex.test(value));
   },
   {
      message:
         "Password does not meet all requirements. Please check and try again.",
   }
);

export const requiredSchema = z.string();
