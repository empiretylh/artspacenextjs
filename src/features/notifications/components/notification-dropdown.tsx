"use client";

import React, { useState } from "react";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";
import { NotificationList } from "./notification-list";
import { useNotifications } from "../hooks/use-notifications";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/types";

interface NotificationDropdownProps {
   className?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
   className,
}) => {
   const t = useTranslations("Notifications");
   const router = useRouter();
   const [open, setOpen] = useState(false);
   const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

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
      activeTab === "unread" ? unreadNotifications : notifications;

   const handleItemClick = (notification: AppNotification) => {
      if (!notification.is_read) {
         markAsRead({ id: notification.id });
      }
      setOpen(false);
   };

   const handleViewAll = () => {
      setOpen(false);
      router.push(paths.notifications.path as any);
   };

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="ghost"
               className={cn("h-8 w-8 p-0 relative cursor-pointer", className)}
               aria-label={t("title")}
            >
               {unreadCount > 0 && (
                  <span className="absolute text-[10px] font-semibold text-primary-foreground p-0.5 min-w-5 h-5 flex items-center justify-center -top-2 -right-1 bg-primary rounded-full px-1 shadow-xs animate-in zoom-in-50">
                     {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
               )}
               <Bell className="h-4 w-4" />
            </Button>
         </PopoverTrigger>

         <PopoverContent
            align="end"
            sideOffset={8}
            className="w-80 sm:w-96 p-0 shadow-xl border-border/80 bg-background/95 backdrop-blur-md rounded-xl overflow-hidden"
         >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/20">
               <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{t("title")}</h3>
                  {unreadCount > 0 && (
                     <span className="text-[11px] font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        {unreadCount} {t("new")}
                     </span>
                  )}
               </div>

               {unreadCount > 0 && (
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => markAllAsRead()}
                     disabled={isMarkingAllAsRead}
                     className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1"
                  >
                     <CheckCheck className="w-3.5 h-3.5" />
                     <span>{t("markAllAsRead")}</span>
                  </Button>
               )}
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-border/40 px-3 pt-2 gap-2 text-xs">
               <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={cn(
                     "pb-2 font-medium border-b-2 transition-colors cursor-pointer",
                     activeTab === "all"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
               >
                  {t("all")} ({notifications.length})
               </button>
               <button
                  type="button"
                  onClick={() => setActiveTab("unread")}
                  className={cn(
                     "pb-2 font-medium border-b-2 transition-colors cursor-pointer",
                     activeTab === "unread"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
               >
                  {t("unread")} ({unreadCount})
               </button>
            </div>

            {/* Scrollable List */}
            <div className="max-h-[380px] overflow-y-auto px-1 py-1 divide-y divide-border/20">
               <NotificationList
                  notifications={displayedNotifications.slice(0, 15)}
                  isLoading={isLoading}
                  onItemClick={handleItemClick}
               />
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-border/60 bg-muted/20 text-center">
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewAll}
                  className="w-full h-8 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 cursor-pointer"
               >
                  <span>{t("viewAll")}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
               </Button>
            </div>
         </PopoverContent>
      </Popover>
   );
};
