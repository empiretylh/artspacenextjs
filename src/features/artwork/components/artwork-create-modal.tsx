'use client'
import { BaseDialog } from "@/components/common/dialogs/base-dialog";
import { ArtworkCreateForm } from "./artwork-create-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

type ArtworkCreateProps = {
   isArtworkCreateModalOpen: boolean;
   setIsArtworkCreateModalOpen: (_isOpen: boolean) => void;
};

const ArtworkCreateModal = ({
   isArtworkCreateModalOpen,
   setIsArtworkCreateModalOpen,
}: ArtworkCreateProps) => {
   const [isMounted, setIsMounted] = useState(false)

   useEffect(() => {
      setIsMounted(true)
   }, [])

   if (!isMounted) {
      return null
   }

   return (
      <div>
         <BaseDialog
            title={`Artwork Create Form`}
            description="Fill out the form below to create a new artwork."
            isOpen={isArtworkCreateModalOpen}
            onClose={() => setIsArtworkCreateModalOpen(false)}
         >
            <div>
               <ScrollArea className="h-[600px]">
                  <ArtworkCreateForm onCreateSuccess={() => setIsArtworkCreateModalOpen(false)} />
               </ScrollArea>
            </div>
         </BaseDialog>
      </div>
   );
};

export default ArtworkCreateModal;
