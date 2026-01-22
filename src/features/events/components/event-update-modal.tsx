import { BaseDialog } from "@/components/common/dialogs/base-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventUpdateForm } from "./event-update-form";

type EventUpdateProps = {
   isEventUpdateModalOpen: boolean;
   setIsEventUpdateModalOpen: (_isOpen: boolean) => void;
   event: any; // Replace with your Event type
};

const EventUpdateModal = ({
   isEventUpdateModalOpen,
   setIsEventUpdateModalOpen,
   event,
}: EventUpdateProps) => {
   return (
      <div>
         <BaseDialog
            title="Update Event"
            description="Modify the event details and save the changes."
            isOpen={isEventUpdateModalOpen}
            onClose={() => setIsEventUpdateModalOpen(false)}
         >
            <ScrollArea className="h-[600px]">
               <EventUpdateForm event={event} />
            </ScrollArea>
         </BaseDialog>
      </div>
   );
};

export default EventUpdateModal;
