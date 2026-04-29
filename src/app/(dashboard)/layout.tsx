import { AppSidebar } from "@/components/layout/app-sidebar";
import ScrollContainer from "@/components/layout/scroll-contianer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import EventPopupSlider from "@/features/events/components/event-pop-up-slider";
import { MiniChat } from "@/features/chat/components/mini-chat";

const DashboardLayout = async ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen 3xl:container">
      <SidebarProvider
        className=""
        style={
          {
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
      <EventPopupSlider />
      <MiniChat />
    </div>
  );
};

export default DashboardLayout;
