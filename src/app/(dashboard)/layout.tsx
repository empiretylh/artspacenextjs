import { AppSidebar } from "@/components/layout/app-sidebar";
import ScrollContainer from "@/components/layout/scroll-contianer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import EventPopupSlider from "@/features/events/components/event-pop-up-slider";

const DashboardLayout = async ({ children }: { children?: React.ReactNode }) => {
  // await queryClient.prefetchQuery({
  //   queryKey: queryKeys.event.popUp.list(),
  //   queryFn: () => getPopUpEvents(),
  // });

  return (
    <div className="relative min-h-screen 3xl:container">
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
          <ScrollContainer>
            {children}
          </ScrollContainer>
        </SidebarInset>
      </SidebarProvider>
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
      <EventPopupSlider />
      {/* </HydrationBoundary> */}
    </div>
  );
};

export default DashboardLayout;
