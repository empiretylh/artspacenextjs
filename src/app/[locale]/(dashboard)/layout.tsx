import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import ScrollContainer from "@/components/layout/scroll-contianer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import EventPopupSlider from "@/features/events/components/event-pop-up-slider";
import { MiniChat } from "@/features/chat/components/mini-chat";
import { ScrollArea } from "@/components/ui/scroll-area";

const DashboardLayout = async ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen 4xl:container">
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
        <SidebarInset className="mb-0! overflow-hidden h-screen">
          {/* <ScrollArea className=" h-screen overflow-y-auto">
            <div className="bg-red-300 h-[300vh]">

            </div>
          </ScrollArea> */}
          {/* <ScrollArea className="bg-red-300 h-[300vh]">
            <div className=""></div>
          </ScrollArea> */}
          <ScrollContainer>
            {children}
          </ScrollContainer>
        </SidebarInset>
        <MobileNav />
      </SidebarProvider>
      <EventPopupSlider />
      <MiniChat />
    </div>
  );
};

export default DashboardLayout;
