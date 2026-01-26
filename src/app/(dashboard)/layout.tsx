import { ScrollToTop } from "@/components/common/scroll-to-top";
import { AppSidebar } from "@/components/layout/app-sidebar";
import Footer from "@/components/layout/footer";
import MainOutlet from "@/components/layout/main-outlet";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { queryKeys } from "@/config/query-keys";
import EventPopupSlider from "@/features/events/components/event-pop-up-slider";
import { getPopUpEvents } from "@/features/service/artspace/get-pop-up-events";
import { getSession } from "@/lib/auth";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies, headers } from "next/headers";
import { userAgent } from "next/server";

const DashboardLayout = async ({ children }: { children?: React.ReactNode }) => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  // 1. Get Sidebar state from Shadcn's default cookie
  if (cookieStore.get("sidebar_state")?.value === undefined) {
    cookieStore.set("sidebar_state", "true", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  }

  const isSidebarOpen = cookieStore.get("sidebar_state")?.value === "true";

  // 2. Get Mobile status from Headers
  const { device } = userAgent({ headers: headerStore });
  const isMobile = device.type === 'mobile';

  const { user } = await getSession()

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
        defaultOpen={isSidebarOpen}
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="mb-0!">
          <div id="scroll-container" className="h-screen flex justify-between flex-col overflow-y-auto" style={{
            scrollbarGutter: "stable"
          }}>
            <div>
              <SiteHeader isLoggedIn={!!user} />
              <MainOutlet isMobile={isMobile} isOpen={isSidebarOpen}>
                {children}
              </MainOutlet>
            </div>
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
