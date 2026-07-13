import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import { getImage } from "@/lib/utils";
import type { SearchUser } from "@/features/service/artspace/get-global-search";

interface UserSearchCardProps {
   user: SearchUser;
   type: "artist" | "gallery" | "collector" | "buyer";
}

export default function UserSearchCard({ user, type }: UserSearchCardProps) {
   const avatarSrc = user.avatar ? getImage(user.avatar) : "/assets/profile-default.png";
   
   let profileLink = "";
   if (type === "artist") {
      profileLink = paths.artists.detail.getHref(String(user.id));
   } else if (type === "gallery") {
      profileLink = paths.galleries.detail.getHref(String(user.id));
   } else if (type === "collector") {
      profileLink = paths.collectors.detail.getHref(String(user.id));
   }

   const typeLabels: Record<string, string> = {
      artist: "Artist",
      gallery: "Gallery",
      collector: "Collector",
      buyer: "Buyer",
   };

   // Helper component to conditionally wrap the header in a Link if profileLink is available
   const HeaderWrapper = ({ children }: { children: React.ReactNode }) => {
      if (profileLink) {
         return (
            <Link to={profileLink} className="flex items-center gap-3 group/header">
               {children}
            </Link>
         );
      }
      return <div className="flex items-center gap-3">{children}</div>;
   };

   return (
      <div className="flex flex-col h-full border border-border rounded-xl p-4 bg-card/30 hover:bg-card/60 transition-all duration-300 shadow-xs">
         <HeaderWrapper>
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-muted">
               <AppImage
                  src={avatarSrc}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="object-cover"
               />
            </div>
            <div className="min-w-0 flex-1">
               <h3 className="font-semibold text-sm sm:text-base font-display truncate group-hover/header:text-primary transition-colors">
                  {user.name}
               </h3>
               <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">
                     {typeLabels[type]}
                  </span>
                  {type !== "buyer" && (
                     <>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30 shrink-0" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                           {user.num_artworks} {user.num_artworks === 1 ? "Artwork" : "Artworks"}
                        </span>
                     </>
                  )}
               </div>
            </div>
         </HeaderWrapper>

         {/* Popular Artworks mini grid */}
         {user.popular_artworks && user.popular_artworks.length > 0 && (
            <div className="grid grid-cols-4 gap-1.5 mt-4 pt-3 border-t border-border/60">
               {user.popular_artworks.slice(0, 4).map((art) => (
                  <Link
                     key={art.id}
                     to={paths.artworks.detail.getHref(art.id)}
                     className="aspect-square rounded-md overflow-hidden bg-muted group/item block relative"
                  >
                     <AppImage
                        src={getImage(art.image)}
                        alt={art.title}
                        width={60}
                        height={60}
                        containerClassName="w-full h-full object-cover select-none transition-transform duration-500 group-hover/item:scale-105"
                     />
                  </Link>
               ))}
            </div>
         )}
      </div>
   );
}
