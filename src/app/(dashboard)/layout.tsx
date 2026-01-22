'use client'

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import Footer from "@/components/layout/footer";
import MainOutlet from "@/components/layout/main-outlet";
import EventPopupSlider from "@/features/events/components/event-pop-up-slider";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardLayout = ({ children }: { children?: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    localStorage.setItem("theme", localStorage.getItem('theme') ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <>
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
          <MainOutlet>
            {children}
          </MainOutlet>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
      {/* <EventPopupSlider /> */}
    </>
  );
};

export default DashboardLayout;
