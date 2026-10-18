'use client';

import React from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type FormDialogSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";

const SIZE_MAP: Record<FormDialogSize, string> = {
   sm: "sm:max-w-sm",
   md: "sm:max-w-md",
   lg: "sm:max-w-lg",
   xl: "sm:max-w-xl",
   "2xl": "sm:max-w-2xl",
   "3xl": "sm:max-w-3xl",
   "4xl": "sm:max-w-4xl",
   full: "sm:max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]",
};

export interface FormDialogProps {
   isOpen: boolean;
   onClose: () => void;
   title: React.ReactNode;
   description?: React.ReactNode;
   icon?: React.ReactNode;
   iconClassName?: string;
   size?: FormDialogSize;
   className?: string;
   contentClassName?: string;
   bodyClassName?: string;
   children: React.ReactNode;
   // Footer configuration
   footer?: React.ReactNode;
   showFooter?: boolean;
   formId?: string;
   submitText?: string;
   cancelText?: string;
   resetText?: string;
   onReset?: () => void;
   isSubmitting?: boolean;
   isSubmitDisabled?: boolean;
   onSubmit?: (e: React.FormEvent) => void;
   submitVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
   headerExtra?: React.ReactNode;
   mobileFullscreen?: boolean;
}

export const FormDialog: React.FC<FormDialogProps> = ({
   isOpen,
   onClose,
   title,
   description,
   icon,
   iconClassName,
   size = "md",
   className,
   bodyClassName,
   children,
   footer,
   showFooter = true,
   formId,
   submitText = "Save",
   cancelText = "Cancel",
   resetText = "Reset",
   onReset,
   isSubmitting = false,
   isSubmitDisabled = false,
   onSubmit,
   submitVariant = "default",
   headerExtra,
   mobileFullscreen = true,
}) => {
   const handleOpenChange = (open: boolean) => {
      if (!open && !isSubmitting) {
         onClose();
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
         <DialogContent
            data-testid="form-dialog"
            className={cn(
               // Base Desktop modal layout
               "w-full p-0 overflow-hidden gap-0 border border-border/80 shadow-2xl bg-card flex flex-col",
               // Mobile Fullscreen vs Standard Dialog styling
               mobileFullscreen
                  ? "max-sm:fixed max-sm:inset-0 max-sm:top-0 max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:w-full max-sm:max-w-none max-sm:h-[100svh] max-sm:max-h-[100svh] max-sm:rounded-none max-sm:border-0 sm:rounded-2xl sm:max-h-[86vh]"
                  : "rounded-2xl max-h-[90vh] sm:max-h-[86vh]",
               SIZE_MAP[size],
               className
            )}
         >
            {/* Standard Header matching Boards Dialog standard (with safe-area top inset for notch / mobile browser bar) */}
            <DialogHeader
               className={cn(
                  "p-5 pb-4 border-b border-border/60 text-left shrink-0",
                  mobileFullscreen && "max-sm:pt-[max(1.25rem,env(safe-area-inset-top))]"
               )}
            >
               <div className="flex items-start justify-between gap-3 pr-6">
                  <div className="min-w-0">
                     <DialogTitle className="text-lg font-semibold font-display tracking-tight text-foreground flex items-center gap-2.5">
                        {icon && (
                           <span
                              className={cn(
                                 "p-1.5 rounded-md bg-primary/10 text-primary shrink-0 flex items-center justify-center",
                                 iconClassName
                              )}
                           >
                              {icon}
                           </span>
                        )}
                        <span className="truncate">{title}</span>
                     </DialogTitle>
                     {description && (
                        <DialogDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
                           {description}
                        </DialogDescription>
                     )}
                  </div>
                  {headerExtra && <div className="shrink-0">{headerExtra}</div>}
               </div>
            </DialogHeader>

            {/* Scrollable Form Body */}
            <div
               className={cn(
                  "flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 min-h-0",
                  bodyClassName
               )}
            >
               {children}
            </div>

            {/* Standard Sticky Footer matching Boards Dialog (with safe-area bottom inset for Safari / iOS home bar) */}
            {showFooter && (
               <div
                  className={cn(
                     "flex items-center gap-2.5 px-5 sm:px-6 py-3.5 border-t border-border/60 bg-card shrink-0 z-10",
                     mobileFullscreen && "max-sm:pb-[max(0.875rem,env(safe-area-inset-bottom))]",
                     onReset ? "justify-between" : "justify-end"
                  )}
               >
                  {footer ? (
                     footer
                  ) : (
                     <>
                        {onReset && (
                           <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={onReset}
                              disabled={isSubmitting}
                              data-testid="form-dialog-reset-button"
                              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer -ml-2"
                           >
                              {resetText}
                           </Button>
                        )}
                        <div className="flex items-center gap-2.5">
                           <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={onClose}
                              disabled={isSubmitting}
                              data-testid="form-dialog-cancel-button"
                              className="px-4 text-xs font-medium cursor-pointer"
                           >
                              {cancelText}
                           </Button>
                           <Button
                              type="submit"
                              size="sm"
                              form={formId}
                              onClick={onSubmit ? (e) => onSubmit(e) : undefined}
                              disabled={isSubmitting || isSubmitDisabled}
                              variant={submitVariant}
                              data-testid="form-dialog-submit-button"
                              className="px-5 text-xs font-semibold cursor-pointer"
                           >
                              {isSubmitting && (
                                 <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                              )}
                              {submitText}
                           </Button>
                        </div>
                     </>
                  )}
               </div>
            )}
         </DialogContent>
      </Dialog>
   );
};

export interface FormSectionProps {
   title?: React.ReactNode;
   description?: React.ReactNode;
   icon?: React.ReactNode;
   children: React.ReactNode;
   className?: string;
   headerClassName?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
   title,
   description,
   icon,
   children,
   className,
   headerClassName,
}) => {
   return (
      <div className={cn("space-y-3.5", className)}>
         {(title || description) && (
            <div
               className={cn(
                  "flex flex-col gap-0.5 pb-2 border-b border-border/40",
                  headerClassName
               )}
            >
               {title && (
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                     {icon && <span className="text-primary">{icon}</span>}
                     {title}
                  </h4>
               )}
               {description && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                     {description}
                  </p>
               )}
            </div>
         )}
         <div>{children}</div>
      </div>
   );
};

export default FormDialog;
