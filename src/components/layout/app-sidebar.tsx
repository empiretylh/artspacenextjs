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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const { open } = useSidebar()

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
