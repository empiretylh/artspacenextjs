"use client";

import React from "react";
import { NotificationItem } from "./notification-item";
import { BellOff, Loader2 } from "lucide-react";
import type { AppNotification } from "@/types";
import { useTranslations } from "next-intl";

interface NotificationListProps {
   notifications: AppNotification[];
   isLoading?: boolean;
   onItemClick?: (notification: AppNotification) => void;
   emptyMessage?: string;
}

export const NotificationList: React.FC<NotificationListProps> = ({
   notifications,
   isLoading = false,
   onItemClick,
   emptyMessage,
}) => {
   const t = useTranslations("Notifications");

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center p-8 text-muted-foreground gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-xs">{t("loading")}</span>
         </div>
      );
   }

   if (notifications.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground gap-2">
            <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center">
               <BellOff className="w-5 h-5 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium">{emptyMessage || t("empty")}</p>
            <p className="text-xs text-muted-foreground/80 max-w-[220px]">
               {t("emptyDescription")}
            </p>
         </div>
      );
   }

   return (
      <div className="flex flex-col divide-y divide-border/30">
         {notifications.map((notification) => (
            <NotificationItem
               key={notification.id}
               notification={notification}
               onItemClick={onItemClick}
            />
         ))}
      </div>
   );
};
