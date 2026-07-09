"use client";

import { env } from "@/config/env";

import {
   SidebarGroup,
   SidebarGroupContent,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "../common/link";
import { usePathname, useRouter } from "@/i18n/routing";
import React from "react";
import { paths } from "@/config/paths";
import { useTranslations } from "next-intl";
import SmileysIcon from "../icons/smileys-icon";
import ArtworksIcon from "../icons/artworks-icon";
import ArtistsIcon from "../icons/artists-icon";
import GalleryExportIcon from "../icons/gallery-export-icon";
import Messages2Icon from "../icons/messages-2-icon";
import Layers2Icon from "../icons/layers-2-icon";
import ShoppingCartIcon from "../icons/shopping-cart-icon";
import { ClipboardPenLineIcon, HomeIcon } from "lucide-react";
import { useAuth } from "@/features/auth/store";
import { useUnreadCount } from "@/features/chat/hooks/use-unread-count";


const data = {
   navMain: [
      {
         title: "home",
         url: paths.root.path,
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
         title: "collectors",
         url: paths.collectors.path,
         icon: SmileysIcon,
      },
      {
         title: "gallery",
         url: paths.galleries.path,
         icon: GalleryExportIcon,
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
         disabled: false,
      },
      {
         title: "order",
         url: paths.order.path,
         icon: ShoppingCartIcon,
         disabled: false,
      },
      // {
      //    title: "settings",
      //    url: paths.settings.path,
      //    icon: Settings2Icon,
      //    disabled: true,
      // },
      // {
      //    title: "Lifecycle",
      //    url: "#",
      //    icon: LayoutDashboard,
      // },
      // {
      //    title: "Analytics",
      //    url: "#",
      //    icon: LayoutDashboard,
      // },
      // {
      //    title: "Projects",
      //    url: "#",
      //    icon: LayoutDashboard,
      // },
      // {
      //    title: "Team",
      //    url: "#",
      //    icon: LayoutDashboard,
      // },
   ],
};

export function NavMain() {
   const t = useTranslations("Navigation");
   const pathname = usePathname();
   const { setOpenMobile, state } = useSidebar();
   const isCollapsed = state === "collapsed";
   const router = useRouter();
   const { user } = useAuth();
   const { hasUnread } = useUnreadCount();

   const isActive = (url: string) => {
      return pathname === url;
   };

   return (
      <SidebarGroup>
         <SidebarGroupContent>
            <SidebarMenu className="pr-3">
               {data.navMain
                  .filter((item) => {
                     if (item.title === "messages") {
                        return env.NEXT_PUBLIC_FEATURE_CHAT_ENABLE;
                     }
                     return true;
                  })
                  .map((item) => {
                     const active = isActive(item.url);

                     return (
                        <SidebarMenuItem key={item.title}>
                           <SidebarMenuButton
                              asChild
                              size="lg"
                              className={cn(
                                 "hover:bg-primary/16 hover:text-primary active:bg-primary/16 active:text-primary font-display rounded-full",
                                 active && "bg-primary/16 text-primary font-bold"
                              )}
                              tooltip={t(item.title as any)}
                           >
                              <Link
                                 to={item.url}
                                 onClick={(e) => {
                                    const isDisabled = item.disabled || (item.title === "order" && !user);
                                    if (isDisabled) {
                                       e.preventDefault();
                                       return;
                                    }
                                    e.preventDefault();
                                    setOpenMobile(false);
                                    router.push(item.url);
                                 }}
                                 className={cn(
                                    isCollapsed 
                                       ? "flex items-center justify-center w-full h-full" 
                                       : "transition-transform duration-200 ease-out hover:translate-x-1 flex items-center gap-3 w-full",
                                    (item.disabled || ((item.title === "order" && !user)) || (item.title === "messages" && !user)) &&
                                    "pointer-events-none opacity-50"
                                 )}
                              >
                                 <div className="relative flex items-center justify-center shrink-0">
                                    {item.icon && <item.icon className={cn(isCollapsed ? "w-4 h-4" : "w-5 h-5")} />}
                                    {item.title === "messages" && hasUnread && (
                                       <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-500 border-2 border-white dark:border-zinc-950" />
                                    )}
                                 </div>
                                 {!isCollapsed && <span className="text-base">{t(item.title as any)}</span>}
                              </Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     );
                  })}
            </SidebarMenu>
         </SidebarGroupContent>
      </SidebarGroup>
   );
}
