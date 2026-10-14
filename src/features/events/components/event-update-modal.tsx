'use client';

import React, { useEffect, useState } from "react";
import { FormDialog } from "@/components/common/dialogs/form-dialog";
import { EventUpdateForm } from "./event-update-form";
import LoadingPage from "@/components/page/loading-page";
import type { Event } from "@/types";
import { Pencil } from "lucide-react";

type EventUpdateProps = {
   isEventUpdateModalOpen: boolean;
   setIsEventUpdateModalOpen: (_isOpen: boolean) => void;
   event: Event | null;
};

const EventUpdateModal: React.FC<EventUpdateProps> = ({
   isEventUpdateModalOpen,
   setIsEventUpdateModalOpen,
   event,
}) => {
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
   }, []);

   if (!isMounted) {
      return null;
   }

   const handleClose = () => {
      setIsEventUpdateModalOpen(false);
   };

   if (!event) {
      return (
         <FormDialog
            isOpen={isEventUpdateModalOpen}
            onClose={handleClose}
            title="Update Event"
            description="Modify the exhibition details and save your changes."
            icon={<Pencil className="w-4 h-4" />}
            size="3xl"
            showFooter={false}
         >
            <LoadingPage className="h-full min-h-[300px]" />
         </FormDialog>
      );
   }

   return (
      <EventUpdateForm
         event={event}
         isOpen={isEventUpdateModalOpen}
         onClose={handleClose}
         onSuccess={handleClose}
      />
   );
};

export default EventUpdateModal;
