"use client";

import React from "react";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";
import {
   Palette,
   UserPlus,
   Calendar,
   CreditCard,
   Tag,
   RefreshCw,
   Radio,
   Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/types";
import { Link } from "@/i18n/routing";

interface NotificationItemProps {
   notification: AppNotification;
   onItemClick?: (notification: AppNotification, e?: React.MouseEvent) => void;
   compact?: boolean;
}

const getNotificationIcon = (type: NotificationType, compact = false) => {
   const sizeClass = compact ? "w-3.5 h-3.5" : "w-4 h-4";
   switch (type) {
      case "NEW_ARTWORK_FROM_FOLLOWED_ARTIST":
         return <Palette className={cn(sizeClass, "text-purple-500")} />;
      case "NEW_FOLLOWER":
         return <UserPlus className={cn(sizeClass, "text-blue-500")} />;
      case "NEW_EVENT":
         return <Calendar className="w-4 h-4 text-amber-500" />;
      case "NEW_BLOG_POST":
         return <Radio className="w-4 h-4 text-rose-500" />;
      case "ORDER_PAYMENT_COMPLETED":
         return <CreditCard className={cn(sizeClass, "text-emerald-500")} />;
      case "ARTWORK_SOLD":
         return <Tag className={cn(sizeClass, "text-emerald-600")} />;
      case "ORDER_STATUS_CHANGED":
         return <RefreshCw className={cn(sizeClass, "text-indigo-500")} />;
      case "ADMIN_BROADCAST":
         return <Radio className={cn(sizeClass, "text-rose-500")} />;
      case "SYSTEM":
      default:
         return <Bell className={cn(sizeClass, "text-primary")} />;
   }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
   notification,
   onItemClick,
   compact = false,
}) => {
   const handleClick = (e: React.MouseEvent) => {
      onItemClick?.(notification, e);
   };

   const handleAuxClick = (e: React.MouseEvent) => {
      // Middle click (button 1) opens in new tab - mark as read
      if (e.button === 1) {
         onItemClick?.(notification, e);
      }
   };

   let timeAgo = "";
   try {
      timeAgo = formatDistanceToNowStrict(new Date(notification.created_at), {
         addSuffix: true,
      });
   } catch {
      timeAgo = notification.created_at;
   }

   const containerClasses = cn(
      "group relative flex items-start transition-all duration-200 cursor-pointer select-none rounded-xl no-underline text-inherit",
      compact ? "gap-2.5 p-2.5" : "gap-3 p-3 sm:p-3.5",
      !notification.is_read
         ? "bg-primary/[0.04] border border-primary/15 hover:bg-primary/[0.08] hover:border-primary/25 shadow-2xs"
         : "bg-background/40 hover:bg-muted/50 border border-border/40 hover:border-border/70"
   );

   const innerContent = (
      <>
         {/* Icon or Thumbnail */}
         <div className="relative shrink-0 mt-0.5">
            {notification.image_url ? (
               <div
                  className={cn(
                     "relative rounded-full overflow-hidden border border-border/50 shrink-0",
                     compact ? "w-8 h-8" : "w-10 h-10"
                  )}
               >
                  <Image
                     src={notification.image_url}
                     alt={notification.title}
                     fill
                     className="object-cover"
                     unoptimized
                  />
               </div>
            ) : (
               <div
                  className={cn(
                     "flex items-center justify-center rounded-full border transition-colors shrink-0",
                     compact ? "w-8 h-8" : "w-10 h-10",
                     !notification.is_read
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : "bg-muted/60 border-border/50 text-muted-foreground"
                  )}
               >
                  {getNotificationIcon(notification.type, compact)}
               </div>
            )}
            {!notification.is_read && (
               <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-background" />
            )}
         </div>

         {/* Content */}
         <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
               <p
                  className={cn(
                     "text-sm leading-snug truncate",
                     !notification.is_read
                        ? "font-semibold text-foreground"
                        : "font-medium text-foreground/80"
                  )}
               >
                  {notification.title}
               </p>
               <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                  {timeAgo}
               </span>
            </div>

            <p
               className={cn(
                  "text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed"
               )}
            >
               {notification.message}
            </p>
         </div>
      </>
   );

   if (notification.web_route) {
      const isExternal = /^https?:\/\//i.test(notification.web_route);

      if (isExternal) {
         return (
            <a
               href={notification.web_route}
               target="_blank"
               rel="noopener noreferrer"
               onClick={handleClick}
               onAuxClick={handleAuxClick}
               className={containerClasses}
            >
               {innerContent}
            </a>
         );
      }

      return (
         <Link
            href={notification.web_route as any}
            onClick={handleClick}
            onAuxClick={handleAuxClick}
            className={containerClasses}
         >
            {innerContent}
         </Link>
      );
   }

   return (
      <div
         onClick={handleClick}
         onAuxClick={handleAuxClick}
         className={containerClasses}
      >
         {innerContent}
      </div>
   );
};
