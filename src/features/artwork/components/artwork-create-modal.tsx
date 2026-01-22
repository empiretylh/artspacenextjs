import { BaseDialog } from "@/components/common/dialogs/base-dialog";
import { ArtworkCreateForm } from "./artwork-create-form";
import { ScrollArea } from "@/components/ui/scroll-area";

type ArtworkCreateProps = {
   isArtworkCreateModalOpen: boolean;
   setIsArtworkCreateModalOpen: (_isOpen: boolean) => void;
};

const ArtworkCreateModal = ({
   isArtworkCreateModalOpen,
   setIsArtworkCreateModalOpen,
}: ArtworkCreateProps) => {
   return (
      <div>
         <BaseDialog
            title={`Logout`}
            description="Do you want to log out from Dashboard?"
            isOpen={isArtworkCreateModalOpen}
            onClose={() => setIsArtworkCreateModalOpen(false)}
         >
            <div>
               <ScrollArea className="h-[600px]">
                  <ArtworkCreateForm />
               </ScrollArea>
            </div>
         </BaseDialog>
      </div>
   );
};

export default ArtworkCreateModal;
