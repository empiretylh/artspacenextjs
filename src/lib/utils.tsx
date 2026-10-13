import Image from "next/image";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import { UserRouteType } from "@/features/service/artspace/get-users";
import type { ApiErrorResponse, Currency, User } from "@/types";
import { useNotifications } from "@/components/ui/notifications";
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
   form?: UseFormReturn<T>,
   options?: { fallbackTitle?: string; fallbackMessage?: string; showNotification?: boolean }
) => {
   let errorMessage = options?.fallbackMessage || "An unexpected error occurred";
   const errorTitle = options?.fallbackTitle || "Error";
   let hasSetFieldError = false;

   if (error instanceof AxiosError) {
      const data = error.response?.data;

      if (data) {
         if (typeof data === "string") {
            if (data.includes("<!DOCTYPE") || data.includes("<html") || data.includes("<body")) {
               const titleMatch = data.match(/<title>(.*?)<\/title>/i);
               const excMatch = data.match(/<pre class="exception_value">([\s\S]*?)<\/pre>/i);
               errorMessage = excMatch ? excMatch[1].replace(/<[^>]+>/g, "").trim() : (titleMatch ? titleMatch[1].trim() : "Server error");
            } else {
               errorMessage = data.replace(/<[^>]+>/g, "").trim() || "An unexpected error occurred";
            }
         } else if (typeof data === "object") {
            let extractedBackendMsg = "";

            const cleanStr = (val: any) => {
               if (typeof val !== "string") return "";
               if (val.includes("<!DOCTYPE") || val.includes("<html") || val.includes("<body")) {
                  const titleMatch = val.match(/<title>(.*?)<\/title>/i);
                  const excMatch = val.match(/<pre class="exception_value">([\s\S]*?)<\/pre>/i);
                  return excMatch ? excMatch[1].replace(/<[^>]+>/g, "").trim() : (titleMatch ? titleMatch[1].trim() : "Server error");
               }
               return val.replace(/<[^>]+>/g, "").trim();
            };

            // Check for direct message/detail/error properties
            if (typeof (data as any).detail === "string") {
               extractedBackendMsg = cleanStr((data as any).detail);
            } else if (typeof (data as any).message === "string") {
               extractedBackendMsg = cleanStr((data as any).message);
            } else if (typeof (data as any).error === "string") {
               extractedBackendMsg = cleanStr((data as any).error);
            }

            // Key mapping dictionary for backend-to-frontend field mismatch
            const fieldAliases: Record<string, string> = {
               phone_number: "phone",
            };

            // Iterate through response keys
            Object.keys(data).forEach((rawKey) => {
               const key = fieldAliases[rawKey] || rawKey;
               const value = (data as any)[rawKey];

               if (rawKey === "non_field_errors" || rawKey === "detail" || rawKey === "message" || rawKey === "error") {
                  const msg = Array.isArray(value) ? value[0] : (typeof value === "string" ? value : null);
                  if (msg) {
                     extractedBackendMsg = msg;
                     if (form) {
                        form.setError("root", {
                           type: "manual",
                           message: msg,
                        });
                        hasSetFieldError = true;
                     }
                  }
               } else if (Array.isArray(value) && value.length > 0) {
                  const msg = typeof value[0] === "string" ? value[0] : JSON.stringify(value[0]);
                  if (form) {
                     form.setError(key as Path<T>, {
                        type: "manual",
                        message: msg,
                     });
                     hasSetFieldError = true;
                     form.setFocus(key as Path<T>);
                  }
                  if (!extractedBackendMsg) {
                     extractedBackendMsg = msg;
                  }
               } else if (typeof value === "string") {
                  if (form) {
                     form.setError(key as Path<T>, {
                        type: "manual",
                        message: value,
                     });
                     hasSetFieldError = true;
                     form.setFocus(key as Path<T>);
                  }
                  if (!extractedBackendMsg) {
                     extractedBackendMsg = value;
                  }
               }
            });

            if (extractedBackendMsg) {
               errorMessage = extractedBackendMsg;
            }
         }
      } else if (error.message) {
         errorMessage = error.message;
      }
   } else if (error instanceof Error) {
      errorMessage = error.message;
   }

   // Always show notification if explicitly requested OR if no field error was mapped on the form
   const shouldNotify = options?.showNotification ?? (!form || !hasSetFieldError);
   if (shouldNotify) {
      useNotifications.getState().addNotification({
         type: "error",
         title: errorTitle,
         message: errorMessage,
      });
   }

   return errorMessage;
};

export const uuid = () => {
   return uuidv4();
};

export const getImage = (src: string | undefined | null) => {
   if (src && (src.startsWith("https://") || src.startsWith("http://"))) {
      return src;
   }
   if (!src) {
      return "/assets/logo.png";
   }
   const cleanSrc = src.startsWith("/") ? src : `/${src}`;
   return `https://${env.IMAGE_HOSTNAME}${cleanSrc}`;
};

export const getRelativeImagePath = (src: string | undefined | null): string => {
   if (!src) return "";
   if (src.startsWith("http://") || src.startsWith("https://")) {
      try {
         const url = new URL(src);
         if (
            url.hostname === env.IMAGE_HOSTNAME || 
            url.hostname.includes("myanmarartspace.net") || 
            url.hostname === "localhost" ||
            url.hostname === "127.0.0.1"
         ) {
            return url.pathname;
         }
      } catch {
         // fallback
      }
   }
   return src;
};

export const getDate = (date: string) => {
   const newDate = new Date(date);
   return format(newDate, "MMMM d, yyyy");
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
   return <Image width={16} height={16} src={'/assets/logo.png'} className="inline-block" alt="logo" />;
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
   if (authUser && String(authUser.id) === String(user.id)) {
      return paths.profile.path;
   }

   switch (user.user_type) {
      case "ARTIST":
         return paths.artists.detail.getHref(String(user.id));
      case "COLLECTOR":
         return paths.collectors.detail.getHref(String(user.id));
      case "GALLERY":
         return paths.galleries.detail.getHref(String(user.id));
      case "BUYER":
         return paths.buyers.detail.getHref(String(user.id));
      default:
         return paths.artists.detail.getHref(String(user.id));
   }
};

export const getUserDisplayName = (
   user?: {
      name?: string | null;
      first_name?: string | null;
      last_name?: string | null;
      user_type?: string | null;
      profile?: {
         hide_collector_name?: boolean | null;
      } | null;
      hide_collector_name?: boolean | null;
   } | null,
   fallback = "User"
): string => {
   if (!user) return fallback;

   // 1. If backend already returns a single name field (e.g. search, chat user representation)
   if (user.name !== undefined && user.name !== null && user.name.trim() !== "") {
      return user.name.trim();
   }

   // 2. Build full name from first_name and last_name (backend already masks first_name/last_name to "Anonymous" if enabled)
   const fullName = [user.first_name?.trim(), user.last_name?.trim()].filter(Boolean).join(" ");
   if (fullName) {
      return fullName;
   }

   // 3. Fallback: only if backend fields are undefined/empty and collector privacy is toggled
   const isCollector = user.user_type === "COLLECTOR";
   const isHidden = Boolean(user.hide_collector_name || user.profile?.hide_collector_name);
   if (isCollector && isHidden) {
      return "Anonymous";
   }

   return fallback;
};

export const getUserRouteType = (entityType: string) => {
   switch (entityType) {
      case "ARTIST":
         return "artists";
      case "COLLECTOR":
         return "collectors";
      case "GALLERY":
         return "galleries";
      case "BUYER":
         return "buyers";
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


const defaultGetPriceArgs = {
   currency: { code: "USD", name: "USD", numeric_code: "840", symbol: "$" },
   price: 0,
};

export const getPriceParts = (
   { currency, price }: { currency?: Currency; price: string | number } = defaultGetPriceArgs
) => {
   const numericPrice =
      typeof price === "string" ? Number(price) : price;

   if (!Number.isFinite(numericPrice)) {
      return null;
   }

   const normalizedCurrency = (currency?.code || "USD").toUpperCase();
   const finalCurrency =
      normalizedCurrency === "MMK" || normalizedCurrency === "USD"
         ? normalizedCurrency
         : "USD";

   const fractionDigits = 0;

   const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: finalCurrency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
   });

   return formatter.formatToParts(numericPrice);
};
