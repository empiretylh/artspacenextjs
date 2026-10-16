'use client'

import { ReportButton } from "@/components/app/report-button";
import { ShareButton } from "@/components/common/share-button";
import { Button } from "@/components/ui/button";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import type { Artwork } from "@/types";
import { MoreVertical } from "lucide-react";

const ArtworkDetailMore = ({ artwork }: { artwork: Artwork }) => {
   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               size="icon"
               className="bg-background/85 hover:bg-background text-foreground/80 hover:text-foreground backdrop-blur-md border-border/70 shadow-xs rounded-full h-9 w-9 cursor-pointer transition-colors"
               aria-label="More options"
            >
               <MoreVertical className="w-4 h-4" />
            </Button>
         </PopoverTrigger>
         <PopoverContent align="end" className="p-1 w-32 rounded-lg shadow-md border-border/70">
            <ShareButton
               content_type={"artwork"}
               item_id={artwork.id}
               item_name={artwork.title}
               variant="ghost"
               size="sm"
               className="w-full justify-start rounded-md border-0 text-xs font-medium cursor-pointer h-8 px-2.5 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
               textButton
            />
            <ReportButton
               className="w-full justify-start rounded-md border-0 text-xs font-medium cursor-pointer text-foreground hover:text-destructive hover:bg-destructive/10 transition-colors h-8 px-2.5"
               itemId={artwork.id}
               reportType="artwork"
               variant="ghost"
            />
         </PopoverContent>
      </Popover>
   );
};

export default ArtworkDetailMore;
