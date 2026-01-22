import { useAuth } from "@/features/auth/store";
import ComingSoonModal from "@/features/coming-soon/components/coming-soon-modal";
import EventPopupSlider from "@/features/events/components/event-pop-up-slider";
import { useEffect } from "react";
import { Outlet } from "react-router";
// import { ScrollToTop } from "../common/scroll-to-top";

const GlobalLayout = () => {
   const { init } = useAuth();

   useEffect(() => {
      if (!localStorage.getItem("theme")) {
         const prefersDarkMode = window.matchMedia(
            "(prefers-color-scheme: dark)"
         ).matches;
         localStorage.setItem("theme", prefersDarkMode ? "dark" : "light");
      }

      init();
   }, []);

   return (
      <div>
         <ComingSoonModal />
         {/* <ScrollToTop /> */}
         <Outlet />
      </div>
   );
};

export default GlobalLayout;
