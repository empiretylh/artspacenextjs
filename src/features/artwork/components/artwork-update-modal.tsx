'use client';

import React, { useEffect, useState } from "react";
import { FormDialog } from "@/components/common/dialogs/form-dialog";
import { ArtworkUpdateForm } from "./artwork-update-form";
import type { Artwork } from "@/types";
import LoadingPage from "@/components/page/loading-page";
import { Pencil } from "lucide-react";

type ArtworkUpdateProps = {
   isArtworkUpdateModalOpen: boolean;
   setIsArtworkUpdateModalOpen: (_isOpen: boolean) => void;
   artwork: Artwork | null;
};

const ArtworkUpdateModal: React.FC<ArtworkUpdateProps> = ({
   isArtworkUpdateModalOpen,
   setIsArtworkUpdateModalOpen,
   artwork,
}) => {
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
   }, []);

   if (!isMounted) {
      return null;
   }

   const handleClose = () => {
      setIsArtworkUpdateModalOpen(false);
   };

   if (!artwork) {
      return (
         <FormDialog
            isOpen={isArtworkUpdateModalOpen}
            onClose={handleClose}
            title="Update Artwork"
            description="Modify the artwork details and save your changes."
            icon={<Pencil className="w-4 h-4" />}
            size="3xl"
            showFooter={false}
         >
            <LoadingPage className="h-full min-h-[300px]" />
         </FormDialog>
      );
   }

   return (
      <ArtworkUpdateForm
         artwork={artwork}
         isOpen={isArtworkUpdateModalOpen}
         onClose={handleClose}
         onUpdateSuccess={handleClose}
      />
   );
};

export default ArtworkUpdateModal;
