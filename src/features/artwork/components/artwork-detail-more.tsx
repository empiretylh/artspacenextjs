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
            <Button variant="ghost" size="icon">
               <MoreVertical />
            </Button>
         </PopoverTrigger>
         <PopoverContent align="end" className="p-0 max-w-30">
            <ReportButton
               className="w-full justify-start rounded-b-none"
               itemId={artwork.id}
               reportType="artwork"
               variant="outline"
            />
            <ShareButton
               variant="outline"
               size="sm"
               className="w-full justify-start rounded-t-none"
               textButton
            />
         </PopoverContent>
      </Popover>
   );
};

export default ArtworkDetailMore;
