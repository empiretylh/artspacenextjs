'use client'
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const MainOutlet = ({ children }: { children?: React.ReactNode }) => {
   const { open } = useSidebar();
   const mobile = useIsMobile();

   return (
      <div
         data-slot="sidebar-inset"
         className={cn(
            "mx-auto w-full",
            open
               ? "max-w-[calc(98vw-var(--sidebar-width))]"
               : "max-w-[calc(92.9vw-var(--sidebar-width-icon)+(calc(0.3rem*4))+2px)]",
            mobile && "max-w-full",
            "px-4 pt-4 pb-4"
         )}
      >
         {children}
      </div>
   );
};

export default MainOutlet;
