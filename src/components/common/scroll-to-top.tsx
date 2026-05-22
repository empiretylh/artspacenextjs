'use client'
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const ScrollToTop = () => {
   const pathname = usePathname();
   useEffect(() => {
      // Use requestAnimationFrame to ensure we don't block the initial render
      // of the new page and that the DOM is ready.
      requestAnimationFrame(() => {
         const scrollContainer = document.querySelector('#scroll-container');
         if (scrollContainer) {
            scrollContainer.scrollTo({
               top: 0,
            });
         }
      });
   }, [pathname]);

   return null;
};
