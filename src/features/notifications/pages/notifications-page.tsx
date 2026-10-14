"use client";

import React, { useState } from "react";
import { useNotifications } from "../hooks/use-notifications";
import { NotificationList } from "../components/notification-list";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/types";

export const NotificationsPage: React.FC = () => {
   const t = useTranslations("Notifications");
   const [tab, setTab] = useState<"all" | "unread">("all");

   const {
      notifications,
      unreadNotifications,
      unreadCount,
      isLoading,
      markAsRead,
      markAllAsRead,
      isMarkingAllAsRead,
   } = useNotifications();

   const displayedNotifications =
      tab === "unread" ? unreadNotifications : notifications;

   const handleItemClick = (notification: AppNotification) => {
      if (!notification.is_read) {
         markAsRead({ id: notification.id });
      }
   };

   return (
      <div className="w-full space-y-6">
         {/* Page Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bell className="w-5 h-5" />
               </div>
               <div>
                  <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                     {t("title")}
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                     {t("subtitle")}
                  </p>
               </div>
            </div>

            {unreadCount > 0 && (
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAsRead()}
                  disabled={isMarkingAllAsRead}
                  className="self-start sm:self-auto cursor-pointer flex items-center gap-1.5 shadow-xs"
               >
                  <CheckCheck className="w-4 h-4 text-primary" />
                  <span>{t("markAllAsRead")}</span>
               </Button>
            )}
         </div>

         {/* Filter Tabs */}
         <div className="flex border-b border-border/60 gap-6 text-sm">
            <button
               type="button"
               onClick={() => setTab("all")}
               className={cn(
                  "pb-3 font-medium border-b-2 transition-colors cursor-pointer select-none",
                  tab === "all"
                     ? "border-primary text-foreground font-semibold"
                     : "border-transparent text-muted-foreground hover:text-foreground"
               )}
            >
               {t("all")} ({notifications.length})
            </button>
            <button
               type="button"
               onClick={() => setTab("unread")}
               className={cn(
                  "pb-3 font-medium border-b-2 transition-colors cursor-pointer select-none",
                  tab === "unread"
                     ? "border-primary text-foreground font-semibold"
                     : "border-transparent text-muted-foreground hover:text-foreground"
               )}
            >
               {t("unread")} ({unreadCount})
            </button>
         </div>

         {/* Notifications List Container */}
         <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
            <NotificationList
               notifications={displayedNotifications}
               isLoading={isLoading}
               onItemClick={handleItemClick}
            />
         </div>
      </div>
   );
};

export default NotificationsPage;
