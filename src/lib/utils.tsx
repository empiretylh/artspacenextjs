import AppImage from "@/components/common/app-image";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import { UserRouteType } from "@/features/service/artspace/get-users";
import type { ApiErrorResponse, User } from "@/types";
import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import type { Path, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function convertBase64(file: File): Promise<string> {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => {
         reject(
            new Error(
               (error.target as FileReader).error?.message ??
               "An error occurred"
            )
         );
      };
   });
}

export const date = {
   show: (isoDate: Date | string): string => {
      // Parse the ISO 8601 date string into a Date object
      const date = new Date(isoDate);

      // Define an array of month names
      const months = [
         "Jan",
         "Feb",
         "Mar",
         "Apr",
         "May",
         "Jun",
         "Jul",
         "Aug",
         "Sep",
         "Oct",
         "Nov",
         "Dec",
      ];

      // Extract the day, month, and year
      const day = date.getDate().toString().padStart(2, "0"); // Ensure two digits for the day
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      // Format the date into the desired string
      return `${day} ${month} ${year}`;
   },
};

export const handleFormError = <T extends Record<string, unknown>>(
   error: unknown,
   form: UseFormReturn<T>
) => {
   if (error instanceof AxiosError) {
      const data = error.response?.data as ApiErrorResponse<T> | undefined;
      if (!data) return;

      // Handle field-specific validation errors
      Object.keys(data).forEach((key) => {
         const value = data[key as keyof typeof data];
         if (key === "non_field_errors" && Array.isArray(value)) {
            // ✅ Handle general (non-field) errors — attach to form root
            form.setError("root", {
               type: "manual",
               message: value[0] || "An unexpected error occurred",
            });
         } else if (Array.isArray(value)) {
            // ✅ Handle field-level errors
            const field = key as Path<T>;
            const message = value[0] ?? "Validation error";
            form.setError(field, {
               type: "manual",
               message,
            });
         }
         form.setFocus(key as Path<T>);
      });
   }
};

export const uuid = () => {
   return uuidv4();
};

export const getImage = (src: string | undefined | null) => {
   if (src && src?.startsWith("https")) {
      return src;
   }
   return `${src ? "https://" + env.IMAGE_HOSTNAME + src : '/assets/logo.png'
      }`;
};

export const getDate = (date: string) => {
   const newDate = new Date(date);
   return format(newDate, "MMMM d, yyyy");
};

export const getPrice = (price: number) => {
   price = price / 100;
   return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
   }).format(price);
};

export const generateFormdata = (values: any, excepts: string[] = []) => {
   const formData = new FormData();
   for (const key in values) {
      if (!excepts.includes(key)) {
         if (Object.prototype.hasOwnProperty.call(values, key)) {
            const value = values[key];
            formData.append(key, value);
         }
      }
   }

   return formData;
};

export function timeAgo(isoDate: string): string {
   const date = parseISO(isoDate);

   return formatDistanceToNow(date, {
      addSuffix: true,
   });
}

export const slugify = (text: string) => {
   return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^\w-]+/g, "") // Remove all non-word and non-hyphen characters
      .replace(/--+/g, "-") // Replace multiple hyphens with a single one
      .replace(/^-+/, "") // Trim leading hyphens
      .replace(/-+$/, ""); // Trim trailing hyphens
};

export const getUserIcon = (_type?: User["user_type"]) => {
   return <AppImage withoutContainer width={16} height={16} src={'/assets/logo.png'} className="inline-block" alt="logo" />;
   // if (type === "ARTIST") {
   //    return (
   //       <span className="inline-block border-2 border-primary p-1 rounded-full">
   //          <ArtistMarkIcon size={14} />
   //       </span>
   //    );
   // } else if (type === "COLLECTOR") {
   //    return (
   //       <span className="inline-block border-2 border-primary p-1 rounded-full">
   //          <CollectorIcon size={14} />
   //       </span>
   //    );
   // } else if (type === "BUYER") {
   //    return (
   //       <span className="inline-block border-2 border-primary p-1 rounded-full">
   //          <CollectorIcon size={14} />
   //       </span>
   //    );
   // } else if (type === "GALLERY") {
   //    return (
   //       <span className="inline-block border-2 border-primary p-1 rounded-full">
   //          <GalleryIcon size={14} />
   //       </span>
   //    );
   // }
};

export function getScrollbarWidth() {
   return window.innerWidth - document.documentElement.clientWidth;
}

let scrollPosition = 0;

export function disableScroll() {
   scrollPosition = window.scrollY;

   const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

   document.body.style.overflow = "hidden";
   document.body.style.position = "fixed";
   document.body.style.top = `- ${scrollPosition} px`;
   document.body.style.left = "0";
   document.body.style.width = "100%";

   if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth} px`;
   }
}

export function enableScroll() {
   document.body.style.overflow = "";
   document.body.style.top = "";
   document.body.style.left = "";
   document.body.style.width = "";
   document.body.style.paddingRight = "";
   document.body.style.position = "";

   // Restore scroll position exactly
   window.scrollTo(0, scrollPosition);
}

export function getDirtyValues<T>(dirtyFields: any, allValues: T): Partial<T> {
   if (!dirtyFields || typeof dirtyFields !== "object") return {};

   const result: any = Array.isArray(dirtyFields) ? [] : {};

   for (const key in dirtyFields) {
      if (!dirtyFields.hasOwnProperty(key)) continue;

      const dirtyValue = dirtyFields[key];

      if (dirtyValue === true) {
         result[key] = (allValues as any)[key];
      } else if (typeof dirtyValue === "object") {
         const nested = getDirtyValues(dirtyValue, (allValues as any)[key]);

         if (
            nested !== undefined &&
            (typeof nested !== "object" || Object.keys(nested).length > 0)
         ) {
            result[key] = nested;
         }
      }
   }

   return result;
}

export const getUserLink = (user: User, authUser: User) => {
   if (authUser?.id === user.id) {
      return paths.profile.path;
   }

   switch (user.user_type) {
      case "ARTIST":
         return paths.artists.detail.getHref(String(user.id));
      case "COLLECTOR":
         return paths.collectors.detail.getHref(String(user.id));
      case "GALLERY":
         return paths.galleries.detail.getHref(String(user.id));
      default:
         return paths.artists.detail.getHref(String(user.id));
   }
};

export const getUserRouteType = (entityType: string) => {
   switch (entityType) {
      case "ARTIST":
         return "artists";
      case "COLLECTOR":
         return "collectors";
      case "GALLERY":
         return "galleries";
      default:
         return "artists";
   }
};

export const getUserPath = (userRouteType: UserRouteType) => {
   let newUserType = userRouteType.substring(0, userRouteType.length - 1);
   if (newUserType === 'gallerie') {
      newUserType = 'gallery';
   }
   return newUserType
};

export const snakeToNormal = (id: string) =>
   id
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
