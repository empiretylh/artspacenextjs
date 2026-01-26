'use client'
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const ScrollToTop = () => {
   const pathname = usePathname();
   console.log('here', pathname)
   useEffect(() => {
      const scrollContainer = document.querySelector('#scroll-container');
      if (scrollContainer) {
         scrollContainer.scrollTo({
            top: 0,
         });
      }
   }, [pathname]);

   return null;
};
