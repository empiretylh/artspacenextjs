import { BaseDialog } from "@/components/common/dialogs/base-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArtworkUpdateForm } from "./artwork-update-form";

type ArtworkUpdateProps = {
   isArtworkUpdateModalOpen: boolean;
   setIsArtworkUpdateModalOpen: (_isOpen: boolean) => void;
   artwork: any; // Replace with your Artwork type
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
               <ArtworkUpdateForm
                  artwork={artwork}
                  onUpdateSuccess={() => setIsArtworkUpdateModalOpen(false)}
               />
            </ScrollArea>
         </BaseDialog>
      </div>
   );
};

export default ArtworkUpdateModal;
