import { BaseDialog } from "@/components/common/dialogs/base-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArtworkUpdateForm } from "./artwork-update-form";
import { Artwork } from "@/types";
import LoadingPage from "@/components/page/loading-page";

type ArtworkUpdateProps = {
   isArtworkUpdateModalOpen: boolean;
   setIsArtworkUpdateModalOpen: (_isOpen: boolean) => void;
   artwork: Artwork | null; // Replace with your Artwork type
};

const ArtworkUpdateModal = ({
   isArtworkUpdateModalOpen,
   setIsArtworkUpdateModalOpen,
   artwork,
}: ArtworkUpdateProps) => {
   return (
      <div>
         <BaseDialog
            title="Update Artwork"
            description="Modify the artwork details and save the changes."
            isOpen={isArtworkUpdateModalOpen}
            onClose={() => setIsArtworkUpdateModalOpen(false)}
         >
            <ScrollArea className="h-[600px]">
               {
                  artwork ? (<ArtworkUpdateForm
                     artwork={artwork}
                     onUpdateSuccess={() => setIsArtworkUpdateModalOpen(false)}
                  />) : (<LoadingPage className="h-full" />
                  )
               }
            </ScrollArea>
         </BaseDialog>
      </div>
   );
};

export default ArtworkUpdateModal;
