import { Card } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { useAuth } from "@/features/auth/store";
import {
   Boxes,
   GalleryHorizontal,
   LayoutDashboard,
   Upload,
   User,
} from "lucide-react";
import { useRouter } from "next/navigation";

export const SidebarLink = ({ icon: Icon, label, isActive, href }: any) => {
   const router = useRouter();
   return (
      <button
         onClick={() => router.push(href)}
         className={`flex cursor-pointer hover:bg-primary hover:text-primary-foreground w-full justify-center lg:justify-start items-center p-3 lg:space-x-3 rounded-lg transition-colors ${isActive
            ? "bg-primary text-primary-foreground font-semibold shadow-md"
            : "text-muted-foreground hover:bg-muted"
            }`}
      >
         <Icon className="w-5 h-5" />
         <span className="hidden lg:inline">{label}</span>
      </button>
   );
};
export const Sidebar = ({
   currentSection,
   isActive,
}: {
   currentSection: string;
   isActive: (href: string) => boolean;
}) => {
   const { isArtist } = useAuth();

   return (
      <Card className="p-4 space-y-2 lg:h-full lg:sticky lg:top-4">
         <SidebarLink
            href={paths.dashboard.profile.path}
            icon={User}
            label="Profile"
            isActive={isActive(paths.dashboard.profile.path)}
         />
         <SidebarLink
            href={paths.dashboard.path}
            icon={LayoutDashboard}
            label="Dashboard"
            isActive={isActive(paths.dashboard.path)}
         />
         {isArtist && (
            <>
               <SidebarLink
                  href={paths.dashboard.uploadArtwork.path}
                  icon={Upload}
                  label="Upload New"
                  isActive={isActive(paths.dashboard.uploadArtwork.path)}
               />
               <SidebarLink
                  href={paths.dashboard.artistArtworks.path}
                  icon={GalleryHorizontal}
                  label="Artworks"
                  isActive={isActive(paths.dashboard.artistArtworks.path)}
               />
            </>
         )}
         <SidebarLink
            href={paths.dashboard.orders.path}
            icon={Boxes}
            label="Orders"
            isActive={isActive(paths.dashboard.orders.path)}
         />
      </Card>
   );
};
