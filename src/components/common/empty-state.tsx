import React from "react";
import { type LucideIcon, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
   icon?: LucideIcon | React.ComponentType<{ className?: string }> | React.ReactNode;
   title?: string;
   description?: string;
   action?: React.ReactNode;
   className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
   icon = ImageOff,
   title,
   description,
   action,
   className,
}) => {
   const renderIcon = () => {
      if (!icon) return null;
      if (React.isValidElement(icon)) {
         return icon;
      }
      if (
         typeof icon === "function" ||
         (typeof icon === "object" && icon !== null && "$$typeof" in icon)
      ) {
         const IconComponent = icon as React.ComponentType<{ className?: string }>;
         return <IconComponent className="w-6 h-6" />;
      }
      return null;
   };

   return (
      <div
         className={cn(
            "flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border border-dashed border-border/80 bg-card/30 text-center space-y-3 max-w-lg mx-auto",
            className
         )}
      >
         {icon && (
            <div className="p-3 bg-muted rounded-full text-muted-foreground">
               {renderIcon()}
            </div>
         )}
         {title && (
            <p className="text-sm sm:text-base font-semibold text-foreground">
               {title}
            </p>
         )}
         {description && (
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
               {description}
            </p>
         )}
         {action && <div className="pt-2">{action}</div>}
      </div>
   );
};

export default EmptyState;
