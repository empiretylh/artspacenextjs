import { useEffect, useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { Outlet } from "react-router";
import Footer from "./footer";
import MainOutlet from "./main-outlet";
import EventPopupSlider from "@/features/events/components/event-pop-up-slider";
import { useIsMobile } from "@/hooks/use-mobile";

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
   const [isDarkMode, setIsDarkMode] = useState(
      localStorage.getItem("theme") === "dark" || false
   );

   const isMobile = useIsMobile();

   useEffect(() => {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      if (isDarkMode) {
         document.documentElement.classList.add("dark");
      } else {
         document.documentElement.classList.remove("dark");
      }
   }, [isDarkMode]);

   return (
      // <div className="flex flex-col justify-between min-h-screen">
      //    <div>
      //       <Header
      //          isDarkMode={isDarkMode}
      //          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      //       />
      //       <main>{children ? children : <Outlet />}</main>
      //    </div>
      //    {/* <Footer /> */}
      // </div>
      <>
         {/* <div className="md:hidden">
            <img
               src="/examples/dashboard-light.png"
               width={1280}
               height={843}
               alt="Authentication"
               className="block dark:hidden"
            />
            <img
               src="/examples/dashboard-dark.png"
               width={1280}
               height={843}
               alt="Authentication"
               className="hidden dark:block"
            />
         </div> */}
         <SidebarProvider
            className=""
            style={
               {
                  // "--sidebar-width": "calc(var(--spacing) * 64)",
                  "--header-height": "calc(var(--spacing) * 12 + 9px)",
               } as React.CSSProperties
            }
            defaultOpen={!isMobile}
         >
            <AppSidebar variant="inset" />
            <SidebarInset className="!mt-0 !mb-0">
               <SiteHeader
                  isDarkMode={isDarkMode}
                  toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
               />
               <MainOutlet />
               <Footer />
            </SidebarInset>
         </SidebarProvider>
         <EventPopupSlider />
      </>
   );
};

export default MainLayout;
