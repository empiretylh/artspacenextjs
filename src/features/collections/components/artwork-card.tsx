// components/artwork-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import type { Artwork } from "@/types";
interface Props {
   artwork: Artwork;
}

export function ArtworkCard({ artwork }: Props) {
   return (
      <Card className="w-[220px] shrink-0">
         <img
            src={artwork.image}
            alt={artwork.title}
            className="h-[280px] w-full object-cover rounded-t-md"
         />
         <CardContent className="p-3 space-y-1">
            <p className="text-sm font-medium truncate">{artwork.title}</p>
            <p className="text-xs text-muted-foreground">
               {artwork.artist_name}
            </p>
            {!artwork.hide_price && (
               <p className="text-sm font-semibold">${artwork.price}</p>
            )}
         </CardContent>
      </Card>
   );
}
