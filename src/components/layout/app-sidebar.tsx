"use client";

import { ClipboardPenLineIcon, HomeIcon, LayoutDashboard } from "lucide-react";
import * as React from "react";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarSeparator,
   SidebarTrigger,
   useSidebar,
} from "../ui/sidebar";
import Link from "../common/link";
import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import { ScrollArea } from "../ui/scroll-area";
import Home from "../icons/home-icon";
import { paths } from "@/config/paths";
import FeaturedArtists from "@/features/artist/components/featured-artists";
import { cn } from "@/lib/utils";
import FeaturedGalleries from "@/features/gallery/components/featured-galleries";
import AppSidebarFooter from "./app-sidbar-footer";
import SmileysIcon from "../icons/smileys-icon";
import ArtworksIcon from "../icons/artworks-icon";
import ArtistsIcon from "../icons/artists-icon";
import GalleryExportIcon from "../icons/gallery-export-icon";
import Messages2Icon from "../icons/messages-2-icon";
import Layers2Icon from "../icons/layers-2-icon";
import Settings2Icon from "../icons/settings-2-icon";
import ShoppingCartIcon from "../icons/shopping-cart-icon";

const data = {
   user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
   },
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
         disabled: true,
      },
      {
         title: "inventory",
         url: paths.inventory.path,
         icon: Layers2Icon,
         disabled: true,
      },
      {
         title: "order",
         url: paths.order.path,
         icon: ShoppingCartIcon,
         disabled: true,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const { open } = useSidebar();

   return (
      <Sidebar collapsible="icon" className="h-auto" {...props}>
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton
                     asChild
                     className="data-[slot=sidebar-menu-button]:!p-1.5 justify-start p-0"
                  >
                     <div className="flex justify-start">
                        <SidebarTrigger className="-ml-1" />
                        <Link to={"/"}>
                           <h1 className="uppercase font-display font-bold text-sm">
                              Myanmar Art Space
                           </h1>
                        </Link>
                     </div>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>
         <SidebarContent>
            <ScrollArea className="h-full">
               <NavMain items={data.navMain} />
               <SidebarSeparator
                  className={cn(open ? "block" : "hidden", "my-3")}
               />
               <SidebarGroup className={cn(open ? "block" : "hidden")}>
                  <SidebarContent className="pr-3">
                     <FeaturedArtists />
                  </SidebarContent>
               </SidebarGroup>
               <SidebarSeparator
                  className={cn(open ? "block" : "hidden", "my-3")}
               />
               <SidebarGroup className={cn(open ? "block" : "hidden")}>
                  <SidebarContent className="pr-3">
                     <FeaturedGalleries />
                  </SidebarContent>
               </SidebarGroup>
               <SidebarGroup className={cn(open ? "block" : "hidden")}>
                  <SidebarContent>
                     <AppSidebarFooter />
                  </SidebarContent>
               </SidebarGroup>
            </ScrollArea>
         </SidebarContent>
         {/* <SidebarFooter>
            <NavUser user={data.user} />
         </SidebarFooter> */}
      </Sidebar>
   );
}
