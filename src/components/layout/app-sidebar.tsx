'use client'
import { NavMain } from "@/components/layout/nav-main";
import FeaturedArtists from "@/features/artist/components/featured-artists";
import FeaturedGalleries from "@/features/gallery/components/featured-galleries";
import { cn } from "@/lib/utils";
import * as React from "react";
import Link from "../common/link";
import { ScrollArea } from "../ui/scroll-area";
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarSeparator,
   SidebarTrigger,
   useSidebar
} from "../ui/sidebar";
import AppSidebarFooter from "./app-sidbar-footer";
import AppImage from "@/components/common/app-image";
import { PanelLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const { open, toggleSidebar } = useSidebar()
   const t = useTranslations("Header");

   return (
      <Sidebar collapsible="icon" className="h-auto" {...props}>
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton
                     asChild
                     className="data-[slot=sidebar-menu-button]:!p-1.5 justify-start p-0"
                  >
                     <div className="flex items-center justify-start w-full overflow-hidden">
                        <button
                           onClick={toggleSidebar}
                           className="relative group flex items-center justify-center size-12 -ml-3.5 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer shrink-0"
                           aria-label="Toggle Sidebar"
                        >
                           {/* Logo (Default) */}
                           <AppImage
                              src="/assets/logo.png"
                              alt="Logo"
                              width={32}
                              height={32}
                              className="absolute size-8 md:size-7 object-contain group-hover:opacity-0 transition-opacity duration-200"
                              withoutContainer={true}
                              loading="eager"
                           />
                           {/* Toggle Icon (Hover) */}
                           <PanelLeftIcon className="absolute size-6 md:size-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sidebar-foreground" />
                        </button>
                        <Link
                           to={"/"}
                           className={cn(
                              "uppercase font-display font-bold text-sm whitespace-nowrap transition-all duration-200 -ml-2",
                              open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none hidden"
                           )}
                        >
                           {t("title")}
                        </Link>
                     </div>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>
         <SidebarContent>
            <ScrollArea className="h-full">
               <NavMain />
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
