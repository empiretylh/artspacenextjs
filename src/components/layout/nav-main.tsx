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
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { paths } from "@/config/paths";
import SmileysIcon from "../icons/smileys-icon";
import ArtworksIcon from "../icons/artworks-icon";
import ArtistsIcon from "../icons/artists-icon";
import GalleryExportIcon from "../icons/gallery-export-icon";
import Messages2Icon from "../icons/messages-2-icon";
import Layers2Icon from "../icons/layers-2-icon";
import ShoppingCartIcon from "../icons/shopping-cart-icon";
import { ClipboardPenLineIcon, HomeIcon } from "lucide-react";
import { useAuth } from "@/features/auth/store";


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
   const pathname = usePathname();
   const { setOpenMobile } = useSidebar();
   const router = useRouter();
   const { user } = useAuth();

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
                              className={cn(
                                 "hover:bg-primary/16 hover:text-primary active:bg-primary/16 active:text-primary",
                                 active && "bg-primary/16 text-primary"
                              )}
                              tooltip={
                                 item.title.at(0)?.toUpperCase() +
                                 item.title.slice(1)
                              }
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
                                    (item.disabled || ((item.title === "order" && !user)) || (item.title === "messages" && !user)) &&
                                    "pointer-events-none opacity-50"
                                 )}
                              >
                                 {item.icon && <item.icon />}
                                 <span className="capitalize">{item.title}</span>
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
