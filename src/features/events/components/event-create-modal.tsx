import { BaseDialog } from "@/components/common/dialogs/base-dialog";
import { EventCreateForm } from "./event-create-form";
import { ScrollArea } from "@/components/ui/scroll-area";

type EventCreateProps = {
   isEventCreateModalOpen: boolean;
   setIsEventCreateModalOpen: (_isOpen: boolean) => void;
};

const EventCreateModal = ({
   isEventCreateModalOpen,
   setIsEventCreateModalOpen,
}: EventCreateProps) => {
   return (
      <div>
         <BaseDialog
            title={`Logout`}
            description="Do you want to log out from Dashboard?"
            isOpen={isEventCreateModalOpen}
            onClose={() => setIsEventCreateModalOpen(false)}
         >
            <div>
               <ScrollArea className="h-[600px]">
                  <EventCreateForm />
               </ScrollArea>
            </div>
         </BaseDialog>
      </div>
   );
};

export default EventCreateModal;
