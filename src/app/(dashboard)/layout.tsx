import { AppSidebar } from "@/components/layout/app-sidebar";
import Footer from "@/components/layout/footer";
import MainOutlet from "@/components/layout/main-outlet";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { queryKeys } from "@/config/query-keys";
import EventPopupSlider from "@/features/events/components/event-pop-up-slider";
import { getPopUpEvents } from "@/features/service/artspace/get-pop-up-events";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const DashboardLayout = async ({ children }: { children?: React.ReactNode }) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.event.popUp.list(),
    queryFn: () => getPopUpEvents(),
  });

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
        defaultOpen={true}
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="mb-0! h-screen overflow-hidden">
          <div id="scroll-container" className="h-screen flex justify-between flex-col overflow-y-auto" style={{
            scrollbarGutter: "stable"
          }}>
            <SiteHeader />
            <MainOutlet>
              {children}
            </MainOutlet>
            <Footer />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EventPopupSlider />
      </HydrationBoundary>
    </>
  );
};

export default DashboardLayout;
