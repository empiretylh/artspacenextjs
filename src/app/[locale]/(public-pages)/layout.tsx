import ScrollContainer from "@/components/layout/scroll-contianer";
import { PublicHeader } from "@/components/layout/public-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const PublicPagesLayout = async ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <div className="relative min-h-screen 4xl:container">
      <SidebarProvider className="w-full h-screen overflow-hidden">
        <SidebarInset className="mb-0! overflow-hidden h-screen">
          <ScrollContainer header={<PublicHeader />}>{children}</ScrollContainer>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default PublicPagesLayout;
