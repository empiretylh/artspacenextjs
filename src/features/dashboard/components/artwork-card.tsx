import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { paths } from "@/config/paths";
import type { Artwork } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export const ArtworkCard = ({ artwork }: { artwork: Artwork }) => {
   const router = useRouter();

   return (
      <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300">
         {/* Image and Hover Overlay */}
         <div className="relative aspect-[4/5] overflow-hidden">
            <img
               src={artwork.image}
               alt={artwork.title}
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay for quick action */}
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <Button
                  onClick={() =>
                     router.push(paths.artworks.detail.getHref(artwork.id))
                  }
               >
                  View Details
               </Button>
            </div>
         </div>

         {/* Details */}
         <div className="p-4 space-y-1">
            <h3 className="text-lg font-semibold truncate hover:text-primary transition-colors cursor-pointer">
               {artwork.title}
            </h3>
            <p className="text-sm text-muted-foreground">
               by {artwork.artist_name}
            </p>
            <div className="flex justify-between items-center pt-1">
               <span className="text-xl font-bold text-primary">
                  ${artwork.price}
               </span>
               <Button variant="outline" size="sm" className="h-8">
                  <ShoppingCart className="h-4 w-4 mr-2" /> Add
               </Button>
            </div>
         </div>
      </Card>
   );
};
