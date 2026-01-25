'use client'
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

const MainOutlet = ({ children }: { children?: React.ReactNode }) => {
   const [isMounted, setIsMounted] = useState(false)

   useEffect(() => {
      setIsMounted(true)
   })

   const { open } = useSidebar();
   const mobile = useIsMobile();

   const getClasses = () => {
      let classes = ""
      if (mobile) {
         classes = "max-w-full"
      } else if (open) {
         classes = "max-w-[calc(98vw-var(--sidebar-width))]"
      } else {
         classes = "max-w-[calc(92.9vw-var(--sidebar-width-icon)+(calc(0.3rem*4))+2px)]"
      }
      return classes
   }

   if (!isMounted) return <div
      data-slot="sidebar-inset"
      className={cn(
         "mx-auto w-full max-w-full",
         "px-4 pt-4 pb-4"
      )}
   >
      {children}
   </div>

   return (
      <div
         data-slot="sidebar-inset"
         className={cn(
            "mx-auto w-full",
            getClasses(),
            "px-4 pt-4 pb-4"
         )}
      >
         {children}
      </div>
   );
};

export default MainOutlet;
