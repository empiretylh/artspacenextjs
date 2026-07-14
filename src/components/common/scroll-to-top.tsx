'use client'
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const stripLocale = (path: string) => {
   return path.replace(/^\/[a-z]{2}(?:-[a-zA-Z0-9]+)?(?=\/|$)/, '');
};

const isSameProfileTransition = (prevPath: string, currPath: string) => {
   const cleanPrev = stripLocale(prevPath) || "/";
   const cleanCurr = stripLocale(currPath) || "/";

   // Case 1: Custom user profile (/profile, /profile/artworks, etc.)
   const isPrevSelfProfile = cleanPrev === "/profile" || cleanPrev.startsWith("/profile/");
   const isCurrSelfProfile = cleanCurr === "/profile" || cleanCurr.startsWith("/profile/");
   if (isPrevSelfProfile && isCurrSelfProfile) {
      return true;
   }

   // Case 2: Entity profile (/artists/:id, /collectors/:id, /galleries/:id, /users/:id)
   const profileRegex = /^\/(artists|collectors|galleries|users)\/([^/]+)/;
   const prevMatch = cleanPrev.match(profileRegex);
   const currMatch = cleanCurr.match(profileRegex);

   if (prevMatch && currMatch) {
      const [, prevType, prevId] = prevMatch;
      const [, currType, currId] = currMatch;
      return prevType === currType && prevId === currId;
   }

   return false;
};

// Check if we are navigating "up/back" in route hierarchy (e.g. /artworks/123 -> /artworks)
const isBackNavigation = (prevPath: string, currPath: string) => {
   const cleanPrev = stripLocale(prevPath) || "/";
   const cleanCurr = stripLocale(currPath) || "/";

   if (cleanCurr === "/") return false; // Don't match root home page as general list parent
   return cleanPrev.startsWith(cleanCurr + "/");
};

const restoreScroll = (container: Element, targetScrollTop: number) => {
   let attempts = 0;
   const scroll = () => {
      container.scrollTo({ top: targetScrollTop });
      
      const hasReached = Math.abs(container.scrollTop - targetScrollTop) < 5;
      if (!hasReached && attempts < 120) { // Try up to 2 seconds (120 frames)
         attempts++;
         requestAnimationFrame(scroll);
      }
   };
   requestAnimationFrame(scroll);
};

export const ScrollToTop = () => {
   const pathname = usePathname();
   const prevPathnameRef = useRef<string>("");

   // Save scroll position in real-time as the user scrolls to avoid issues with DOM collapse during navigation
   useEffect(() => {
      const scrollContainer = document.querySelector('#scroll-container');
      if (!scrollContainer) return;

      const handleScroll = () => {
         const scrollTop = scrollContainer.scrollTop;
         // Only save positive values to avoid saving collapsed 0 state during transitions
         if (scrollTop > 0) {
            sessionStorage.setItem(`scroll_${pathname}`, String(scrollTop));
         }
      };

      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
         scrollContainer.removeEventListener('scroll', handleScroll);
      };
   }, [pathname]);

   useEffect(() => {
      const prevPath = prevPathnameRef.current;
      prevPathnameRef.current = pathname;

      const scrollContainer = document.querySelector('#scroll-container');

      // Avoid resetting scroll on hash links or transitions within the same profile
      if (typeof window !== "undefined" && window.location.hash) return;
      if (prevPath && isSameProfileTransition(prevPath, pathname)) return;

      // Determine if this is a "back/up" navigation to restore scroll
      if (prevPath && isBackNavigation(prevPath, pathname)) {
         const savedScrollStr = sessionStorage.getItem(`scroll_${pathname}`);
         if (savedScrollStr && scrollContainer) {
            const savedScroll = parseInt(savedScrollStr, 10);
            if (savedScroll > 0) {
               restoreScroll(scrollContainer, savedScroll);
               return;
            }
         }
      }

      // Default: Reset scroll to top
      requestAnimationFrame(() => {
         if (scrollContainer) {
            scrollContainer.scrollTo({
               top: 0,
            });
         }
      });
   }, [pathname]);

   return null;
};
