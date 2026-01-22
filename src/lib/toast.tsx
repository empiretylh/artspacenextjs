"use client";

import { toast as sonnerToast } from "sonner";
import { cn } from "./utils";

/** I recommend abstracting the toast function
 *  so that you can call it without having to use toast.custom everytime. */
// eslint-disable-next-line react-refresh/only-export-components
export function toast(toast: Omit<ToastProps, "id">) {
   return sonnerToast.custom((id) => (
      <Toast
         id={id}
         type={toast.type ?? "success"}
         title={toast.title}
         description={toast.description}
         button={
            toast.button && {
               label: toast.button.label,
               onClick: () => null,
            }
         }
      />
   ));
}

/** A fully custom toast that still maintains the animations and interactions. */
export function Toast(props: Readonly<ToastProps>) {
   const { title, description, type = "success", button, id } = props;

   return (
      <div className="flex rounded-lg bg-white font-sans shadow-lg ring-1 ring-black/5 w-full items-center p-4">
         <div className="flex flex-1 items-center">
            <div className="w-full">
               <p
                  className={cn(
                     "text-sm font-medium text-gray-900",
                     type === "success" && "text-success",
                     type === "error" && "text-destructive",
                     type === "info" && "text-info",
                     type === "warning" && "text-warning"
                  )}
               >
                  {title}
               </p>
               {description && (
                  <p className="mt-1 text-sm text-gray-500">{description}</p>
               )}
            </div>
         </div>
         {button && (
            <div className="ml-5 shrink-0 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
               <button
                  type="button"
                  className="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
                  onClick={() => {
                     button.onClick();
                     sonnerToast.dismiss(id);
                  }}
               >
                  {button.label}
               </button>
            </div>
         )}
      </div>
   );
}

interface ToastProps {
   id: string | number;
   title: string;
   type?: "info" | "warning" | "success" | "error";
   description?: string;
   button?: {
      label: string;
      onClick: () => void;
   };
}
