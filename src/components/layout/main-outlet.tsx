'use client'
import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";
import { Suspense } from "react";
import LoadingPage from "../page/loading-page";

interface MainOutletProps {
   children?: React.ReactNode;
}

const MainOutlet = ({ children }: MainOutletProps) => {
   // Logic remains the same, but values come from props instead of hooks
   const { open, isMobile } = useSidebar();

   const getClasses = () => {
      if (isMobile) return "max-w-full";
      if (open) return "max-w-[calc(98vw-var(--sidebar-width))]";
      return "max-w-[calc(92.9vw-var(--sidebar-width-icon)+(calc(0.3rem*4))+2px)]";
   };

   return (
      <div
         data-slot="sidebar-inset"
         className={cn(
            "mx-auto w-full px-4 pt-4 pb-4 transition-all duration-300",
            getClasses()
         )}
      >
         <Suspense fallback={<LoadingPage />}>
            {children}
         </Suspense>
      </div>
   );
};

export default MainOutlet;
