"use client";

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
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export function NavMain({
   items,
}: {
   items: {
      title: string;
      url: string;
      icon?: any;
      disabled?: boolean;
   }[];
}) {
   const pathname = usePathname();
   const { setOpenMobile } = useSidebar();
   const router = useRouter();

   const isActive = (url: string) => {
      return pathname === url;
   };

   return (
      <SidebarGroup>
         <SidebarGroupContent>
            <SidebarMenu className="pr-3">
               {items.map((item) => {
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
                                 e.preventDefault();
                                 setOpenMobile(false);
                                 router.push(item.url);
                              }}
                              className={cn(
                                 item.disabled &&
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
