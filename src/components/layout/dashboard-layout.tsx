import { Outlet, useLocation, useNavigate } from "react-router";
import { Sidebar, SidebarLink } from "./sidebar";
import {
   Boxes,
   GalleryHorizontal,
   LayoutDashboard,
   Upload,
   User,
} from "lucide-react";
import { paths } from "@/config/paths";
import { useAuth } from "@/features/auth/store";

const ArtistLayout = () => {
   const location = useLocation(); // 👈 Get current route
   const { isArtist, isCollector } = useAuth();
   const { user } = useAuth();
   const isActive = (href: string) => location.pathname === href;
   const router = useRouter();

   if (!user) {
      router.push(paths.root.path);
   }

   return (
      <div>
         <div className="flex-grow container mx-auto px-4 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
            {/* Sidebar / Navigation */}
            <div className="hidden lg:block">
               <Sidebar
                  isActive={isActive}
                  currentSection={location.pathname}
               />
            </div>

            {/* Mobile Navigation (Bottom Bar) */}
            <div className="bg-card border border-border lg:hidden z-10">
               <div className="flex justify-around p-2">
                  <SidebarLink
                     href={paths.dashboard.path}
                     icon={LayoutDashboard}
                     label="Dashboard"
                     isActive={isActive(paths.dashboard.path)}
                  />
                  <SidebarLink
                     href={paths.dashboard.profile.path}
                     icon={User}
                     label="Profile"
                     isActive={isActive(paths.dashboard.profile.path)}
                  />
                  {(isArtist || isCollector) && (
                     <>
                        <SidebarLink
                           href={paths.dashboard.uploadArtwork.path}
                           icon={Upload}
                           label="Upload New"
                           isActive={isActive(
                              paths.dashboard.uploadArtwork.path
                           )}
                        />
                        <SidebarLink
                           href={paths.dashboard.artistArtworks.path}
                           icon={GalleryHorizontal}
                           label="Artworks"
                           isActive={isActive(
                              paths.dashboard.artistArtworks.path
                           )}
                        />
                     </>
                  )}
                  <SidebarLink
                     href={paths.dashboard.orders.path}
                     icon={Boxes}
                     label="Orders"
                     isActive={isActive(paths.dashboard.orders.path)}
                  />
               </div>
            </div>

            {/* Main Content */}
            <div className="pb-20 lg:pb-0">
               <Outlet />
            </div>
         </div>
      </div>
   );
};

export default ArtistLayout;
