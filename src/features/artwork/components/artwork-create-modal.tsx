'use client';

import React, { useEffect, useState } from "react";
import { ArtworkCreateForm } from "./artwork-create-form";

type ArtworkCreateProps = {
   isArtworkCreateModalOpen: boolean;
   setIsArtworkCreateModalOpen: (_isOpen: boolean) => void;
};

const ArtworkCreateModal = ({
   isArtworkCreateModalOpen,
   setIsArtworkCreateModalOpen,
}: ArtworkCreateProps) => {
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
   }, []);

   if (!isMounted) {
      return null;
   }

   const handleClose = () => {
      setIsArtworkCreateModalOpen(false);
   };

   return (
      <ArtworkCreateForm
         isOpen={isArtworkCreateModalOpen}
         onClose={handleClose}
         onCreateSuccess={handleClose}
      />
   );
};

export default ArtworkCreateModal;
