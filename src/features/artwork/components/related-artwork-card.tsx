import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Artwork } from "@/types";

export const RelatedArtworkCard = ({ artwork }: { artwork: Artwork }) => (
   <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] overflow-hidden">
         <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
         />
         <div className="absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button className="h-8 text-xs">View</Button>
         </div>
      </div>

      <div className="p-3 space-y-0.5">
         <h4 className="text-sm font-semibold truncate hover:text-primary transition-colors cursor-pointer">
            {artwork.title}
         </h4>
         <p className="text-xs text-muted-foreground">{artwork.artist_name}</p>
         <p className="text-sm font-bold text-primary pt-1">
            ${artwork.price.toLocaleString()}
         </p>
      </div>
   </Card>
);
