import AppImage from "@/components/common/app-image";
import AwardIcon from "@/components/icons/award-icon";
import { cn, getImage } from "@/lib/utils";
import type { ArtistBadge } from "@/types";
import { CheckCircle2 } from "lucide-react";

interface ArtistSummaryBadgesProps {
   badges?: ArtistBadge[];
   className?: string;
}

export function ArtistSummaryBadges({
   badges,
   className,
}: ArtistSummaryBadgesProps) {
   if (!badges || badges.length === 0) return null;

   const activeBadges = badges
      .filter((badge) => badge.is_active !== false)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .slice(0, 4);

   if (activeBadges.length === 0) return null;

   return (
      <div
         className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm", className)}
         role="list"
         aria-label="Artist summary badges"
      >
         {activeBadges.map((badge) => (
            <div
               key={badge.id}
               className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border border-border/50 bg-card/40 transition-colors hover:bg-muted/40"
               role="listitem"
            >
               <div className="relative w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 overflow-hidden border border-border/40 p-1">
                  {badge.image ? (
                     <AppImage
                        src={getImage(badge.image)}
                        alt={badge.title}
                        width={36}
                        height={36}
                        className="object-contain w-full h-full"
                     />
                  ) : (
                     <AwardIcon />
                  )}
               </div>

               <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                     {badge.category && (
                        <p className="text-xs text-muted-foreground font-medium truncate">
                           {badge.category}
                        </p>
                     )}
                     <p
                        className="font-semibold text-sm text-foreground truncate"
                        title={badge.title}
                     >
                        {badge.title}
                     </p>
                  </div>

                  {badge.text && (
                     <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25 shrink-0 max-w-[140px]"
                        title={badge.text}
                     >
                        {badge.text.toLowerCase().includes("verified") && (
                           <CheckCircle2 className="w-3.5 h-3.5 mr-1 shrink-0" />
                        )}
                        <span className="truncate">{badge.text}</span>
                     </span>
                  )}
               </div>
            </div>
         ))}
      </div>
   );
}

export default ArtistSummaryBadges;
