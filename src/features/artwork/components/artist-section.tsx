import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Artist } from "@/types";

export const ArtistSection = ({ artist }: { artist: Artist }) => (
   <Card className="p-4 flex items-center space-x-4">
      <img
         src={artist.avatarUrl}
         alt={artist.name}
         className="h-16 w-16 rounded-full object-cover border-2 border-primary"
      />
      <div className="flex-grow space-y-1">
         <p className="text-sm text-muted-foreground">Artwork by</p>
         <h3 className="text-lg font-bold hover:text-primary transition-colors cursor-pointer">
            {artist.name}
         </h3>
         <p className="text-xs text-muted-foreground">
            {artist.artworksCount} available works
         </p>
      </div>
      <Button variant="outline" className="h-8 text-xs px-3">
         Follow
      </Button>
   </Card>
);
