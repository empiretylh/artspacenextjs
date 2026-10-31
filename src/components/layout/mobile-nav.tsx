"use client";

import React from "react";
import Link from "../common/link";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { paths } from "@/config/paths";
import { env } from "@/config/env";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useUnreadCount } from "@/features/chat/hooks/use-unread-count";
import { useChatStore } from "@/features/chat/store";

import { HomeIcon, ClipboardPenLineIcon } from "lucide-react";
import ArtworksIcon from "../icons/artworks-icon";
import ArtistsIcon from "../icons/artists-icon";
import Messages2Icon from "../icons/messages-2-icon";

const mobileNavItems = [
   {
      title: "home",
      url: paths.home.path,
      icon: HomeIcon,
   },
   {
      title: "artwork",
      url: paths.artworks.path,
      icon: ArtworksIcon,
   },
   {
      title: "artist",
      url: paths.artists.path,
      icon: ArtistsIcon,
   },
   {
      title: "event",
      url: paths.events.path,
      icon: ClipboardPenLineIcon,
   },
   {
      title: "messages",
      url: paths.chats.path,
      icon: Messages2Icon,
      isChat: true,
   },
] as const;

export function MobileNav() {
   const t = useTranslations("Navigation");
   const pathname = usePathname();
   const { setOpenMobile } = useSidebar();
   const { hasUnread } = useUnreadCount();
   const activeConversationId = useChatStore((s) => s.activeConversationId);
   const pendingRecipientId = useChatStore((s) => s.pendingRecipientId);

   // Hide on checkout / payment distraction-free flows
   const isDistractionFree = Boolean(
      (pathname?.includes("/artworks/") && pathname?.includes("/order")) ||
      (pathname?.includes("/orders/") && pathname?.includes("/payment"))
   );

   // Hide when inside an active full-screen chat conversation on mobile to give room for keyboard
   const isInActiveChat = Boolean(
      pathname?.includes("/chats") && (activeConversationId || pendingRecipientId)
   );

   if (isDistractionFree || isInActiveChat) {
      return null;
   }

   const filteredItems = mobileNavItems.filter((item) => {
      if ("isChat" in item && item.isChat) {
         return Boolean(env.NEXT_PUBLIC_FEATURE_CHAT_ENABLE);
      }
      return true;
   });

   const isActive = (url: string) => {
      if (!pathname) return false;
      const normalized = pathname.replace(/^\/(en|my)(\/|$)/, "/");

      if (url === "/" || url === paths.home.path) {
         return normalized === "/" || normalized === "/home";
      }
      return normalized === url || normalized.startsWith(`${url}/`);
   };

   const handleTabClick = (active: boolean) => {
      if (setOpenMobile) {
         setOpenMobile(false);
      }
      if (active) {
         const scrollContainer = document.querySelector("#scroll-container");
         if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
         }
      }
   };

   return (
      <nav
         aria-label="Mobile Navigation"
         className={cn(
            "fixed bottom-0 left-0 right-0 z-40 md:hidden",
            "bg-background/95 backdrop-blur-md border-t border-border/80 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]",
            "pb-[env(safe-area-inset-bottom,0px)]"
         )}
      >
         <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
            {filteredItems.map((item) => {
               const active = isActive(item.url);
               const isMessages = item.title === "messages";
               const Icon = item.icon;

               return (
                  <Link
                     key={item.title}
                     to={item.url}
                     onClick={() => handleTabClick(active)}
                     className={cn(
                        "flex-1 flex flex-col items-center justify-center py-1 px-1 h-full min-w-0 select-none group touch-manipulation",
                        "transition-colors duration-150 relative"
                     )}
                  >
                     <div className="relative flex items-center justify-center">
                        <Icon
                           className={cn(
                              "size-5 transition-transform duration-200",
                              active
                                 ? "text-primary scale-110"
                                 : "text-muted-foreground group-hover:text-foreground"
                           )}
                        />
                        {isMessages && hasUnread && (
                           <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-background" />
                           </span>
                        )}
                     </div>
                     <span
                        className={cn(
                           "text-[10px] sm:text-[11px] leading-tight font-medium max-w-full truncate mt-1 transition-colors duration-150",
                           active
                              ? "text-primary font-bold"
                              : "text-muted-foreground group-hover:text-foreground"
                        )}
                     >
                        {t(item.title as any)}
                     </span>
                     {active && (
                        <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                     )}
                  </Link>
               );
            })}
         </div>
      </nav>
   );
}

export default MobileNav;
