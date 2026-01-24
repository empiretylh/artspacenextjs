import { AppSidebar } from "@/components/layout/app-sidebar";
import Footer from "@/components/layout/footer";
import MainOutlet from "@/components/layout/main-outlet";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import EventPopupSlider from "@/features/events/components/event-pop-up-slider";
import { Suspense } from "react";

const DashboardLayout = ({ children }: { children?: React.ReactNode }) => {
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
      // defaultOpen={}
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="mb-0!">
          <div className="h-screen flex justify-between flex-col overflow-y-auto" style={{
            scrollbarGutter: "stable"
          }}>
            <div>
              <SiteHeader />
              <MainOutlet>
                <Suspense fallback={<div>Loading...</div>}>
                  {children}
                </Suspense>
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
