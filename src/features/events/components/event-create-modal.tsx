'use client';

import React, { useEffect, useState } from "react";
import { EventCreateForm } from "./event-create-form";

type EventCreateProps = {
   isEventCreateModalOpen: boolean;
   setIsEventCreateModalOpen: (_isOpen: boolean) => void;
};

const EventCreateModal: React.FC<EventCreateProps> = ({
   isEventCreateModalOpen,
   setIsEventCreateModalOpen,
}) => {
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
   }, []);

   if (!isMounted) {
      return null;
   }

   const handleClose = () => {
      setIsEventCreateModalOpen(false);
   };

   return (
      <EventCreateForm
         isOpen={isEventCreateModalOpen}
         onClose={handleClose}
         onCreateSuccess={handleClose}
      />
   );
};

export default EventCreateModal;
