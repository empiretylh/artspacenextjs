import { AppSidebar } from "@/components/layout/app-sidebar";
import Footer from "@/components/layout/footer";
import MainOutlet from "@/components/layout/main-outlet";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import EventPopupSlider from "@/features/events/components/event-pop-up-slider";
import { cookies, headers } from "next/headers";
import { userAgent } from "next/server";
import { Suspense } from "react";

const DashboardLayout = async ({ children }: { children?: React.ReactNode }) => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  // 1. Get Sidebar state from Shadcn's default cookie
  const isSidebarOpen = (await cookieStore).get("sidebar_state")?.value === "true";

  // 2. Get Mobile status from Headers
  const { device } = userAgent({ headers: await headerStore });
  const isMobile = device.type === 'mobile';

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
        defaultOpen={isSidebarOpen}
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="mb-0!">
          <div className="h-screen flex justify-between flex-col overflow-y-auto" style={{
            scrollbarGutter: "stable"
          }}>
            <div>
              <SiteHeader />
              <MainOutlet isMobile={isMobile} isOpen={isSidebarOpen}>
                {children}
              </MainOutlet>
            </div>
            <Footer />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <EventPopupSlider />
    </>
  );
};

export default DashboardLayout;
