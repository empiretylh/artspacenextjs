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
import { cn, getUserRouteType } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/types";
import { useRouter } from "@/i18n/routing";
import { getUser } from "@/features/service/artspace/get-user";

interface NotificationItemProps {
   notification: AppNotification;
   onItemClick?: (notification: AppNotification) => void;
   compact?: boolean;
}

const getNotificationIcon = (type: NotificationType) => {
   switch (type) {
      case "NEW_ARTWORK_FROM_FOLLOWED_ARTIST":
         return <Palette className="w-4 h-4 text-purple-500" />;
      case "NEW_FOLLOWER":
         return <UserPlus className="w-4 h-4 text-blue-500" />;
      case "NEW_EVENT":
         return <Calendar className="w-4 h-4 text-amber-500" />;
      case "NEW_BLOG_POST":
         return <Radio className="w-4 h-4 text-rose-500" />;
      case "ORDER_PAYMENT_COMPLETED":
         return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case "ARTWORK_SOLD":
         return <Tag className="w-4 h-4 text-emerald-600" />;
      case "ORDER_STATUS_CHANGED":
         return <RefreshCw className="w-4 h-4 text-indigo-500" />;
      case "ADMIN_BROADCAST":
         return <Radio className="w-4 h-4 text-rose-500" />;
      case "SYSTEM":
      default:
         return <Bell className="w-4 h-4 text-primary" />;
   }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
   notification,
   onItemClick,
   compact = false,
}) => {
   const router = useRouter();

   const handleClick = async () => {
      onItemClick?.(notification);

      if (notification.web_route) {
         let targetRoute = notification.web_route;

         // If the backend sent a generic /users/:id link, resolve the real user route directly (e.g. /artists/1)
         const match = targetRoute.match(/^\/users\/(\d+)\/?$/);
         if (match) {
            try {
               const userId = match[1];
               const userData = await getUser({ userId });
               if (userData?.user_type) {
                  const userTypeRoute = getUserRouteType(userData.user_type);
                  targetRoute = `/${userTypeRoute}/${userId}`;
               }
            } catch (err) {
               console.warn("Could not pre-resolve user route:", err);
            }
         }

         router.push(targetRoute as any);
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

   return (
      <div
         onClick={handleClick}
         className={cn(
            "group relative flex items-start gap-3 p-3 transition-colors cursor-pointer select-none rounded-lg",
            "hover:bg-muted/60",
            !notification.is_read ? "bg-primary/5" : "bg-transparent"
         )}
      >
         {/* Icon or Thumbnail */}
         <div className="relative shrink-0 mt-0.5">
            {notification.image_url ? (
               <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border/50">
                  <Image
                     src={notification.image_url}
                     alt={notification.title}
                     fill
                     className="object-cover"
                     unoptimized
                  />
               </div>
            ) : (
               <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border/50">
                  {getNotificationIcon(notification.type)}
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
                     "text-sm leading-tight truncate",
                     !notification.is_read
                        ? "font-semibold text-foreground"
                        : "font-medium text-foreground/80"
                  )}
               >
                  {notification.title}
               </p>
               <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
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
      </div>
   );
};
