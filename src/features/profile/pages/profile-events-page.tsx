import { EventControlActions } from "@/components/app/event-control-actions";
import DeleteConfirmDialog from "@/components/common/dialogs/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import EventCreateModal from "@/features/events/components/event-create-modal";
import EventInviteEmailConfirmDialog from "@/features/events/components/event-invite-email-confirm-dialog";
import EventUpdateModal from "@/features/events/components/event-update-modal";
import { EventWideCard } from "@/features/events/components/event-wide-card";
import EventsPageView from "@/features/events/components/events-page-view";
import { useEventsListInfinite } from "@/features/events/hooks/use-events-list-infinite-hook";
import { useUploadedEventsListInfinite } from "@/features/events/hooks/use-uploaded-events-list-infinite-hook";
import { useEventSoftDelete } from "@/features/service/artspace/event-soft-delete";
import { useSendEmailInviteEvent } from "@/features/service/artspace/send-email-invite-event";
import type { Event } from "@/types";
import { Edit, Mail, Trash } from "lucide-react";
import { useState } from "react";

type ControlledEventCardProps = {
   onInviteButtonClick: (event: Event) => void;
   onUpdateButtonClick: (event: Event) => void;
   onDeleteButtonClick: (event: Event) => void;
   event: Event;
};

const ControlledEventCard: React.FC<ControlledEventCardProps> = ({
   onInviteButtonClick,
   onUpdateButtonClick,
   onDeleteButtonClick,
   event,
}) => {
   return (
      <div className="relative group inline-block break-inside-avoid mb-4 w-full">
         {/* Hover Buttons */}
         <EventWideCard event={event} />
         <div className="absolute top-54 right-2 flex space-x-2">
            <EventControlActions
               onDeleteButtonClick={() => onDeleteButtonClick(event)}
               onUpdateButtonClick={() => onUpdateButtonClick(event)}
               onInviteButtonClick={() => onInviteButtonClick(event)}
            />
            {/* <Button
               size="sm"
               variant="ghost"
               className="p-1 text-primary"
               onClick={() => onInviteButtonClick(event)}
            >
               <Mail className="w-4 h-4" />
            </Button>
            <Button
               size="sm"
               variant="ghost"
               className="p-1 text-primary"
               onClick={() => onUpdateButtonClick(event)}
            >
               <Edit className="w-4 h-4" />
            </Button>
            <Button
               size="sm"
               variant="ghost"
               className="p-1 text-primary"
               onClick={() => onDeleteButtonClick(event)}
            >
               <Trash className="w-4 h-4" />
            </Button> */}
         </div>
      </div>
   );
};

const ProfileEventsPage = () => {
   const [isEventCreateModalOpen, setIsEventCreateModalOpen] = useState(false);
   const {
      isLoading,
      filters,
      setFilters,
      sorts,
      setSorts,
      pagesToRender,
      isDataEmpty,
      removeFromFilter,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
   } = useUploadedEventsListInfinite();

   const [isEventUpdateModalOpen, setIsEventUpdateModalOpen] = useState(false);
   const [isEventInviteEmailModalOpen, setIsEventInviteEmailModalOpen] =
      useState(false);

   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const softDeleteEventMutation = useEventSoftDelete({
      mutationConfig: {
         onSuccess: () => {
            setIsDeleteModalOpen(false);
         },
      },
   });

   const sendEmailInviteEventMutation = useSendEmailInviteEvent({
      mutationConfig: {
         onSuccess: () => {
            setIsEventInviteEmailModalOpen(false);
         },
      },
   });

   const onDeleteButtonClick = (event: Event) => {
      setSelectedEvent(event);
      setIsDeleteModalOpen(true);
   };

   const handleDelete = async () => {
      softDeleteEventMutation.mutate({
         eventId: String(selectedEvent?.id),
      });
   };

   const onUpdateButtonClick = (event: Event) => {
      setSelectedEvent(event);
      setIsEventUpdateModalOpen(true);
   };

   const onInviteButtonClick = (event: Event) => {
      setSelectedEvent(event);
      setIsEventInviteEmailModalOpen(true);
   };

   const handleEventInviteEmail = () => {};

   return (
      <div>
         <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold capitalize font-display">
               Events
            </h1>
            <Button onClick={() => setIsEventCreateModalOpen(true)}>
               Create
            </Button>
         </div>
         <EventCreateModal
            isEventCreateModalOpen={isEventCreateModalOpen}
            setIsEventCreateModalOpen={setIsEventCreateModalOpen}
         />
         <EventInviteEmailConfirmDialog
            isEventInviteEmailModalOpen={isEventInviteEmailModalOpen}
            setIsEventInviteEmailModalOpen={setIsEventInviteEmailModalOpen}
            handleEventInviteEmail={handleEventInviteEmail}
            isLoading={sendEmailInviteEventMutation.isPending}
            title="event"
            description="Are you sure you want to send invitation email to all the artists tagged in this event?"
         />
         <DeleteConfirmDialog
            isDeleteModalOpen={isDeleteModalOpen}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            handleDelete={handleDelete}
            isDeleting={softDeleteEventMutation.isPending}
            title={selectedEvent?.title ? `${selectedEvent?.title}` : "event"}
            description="Are you sure you want to delete this event? This action cannot be undone."
         />
         <EventUpdateModal
            event={selectedEvent}
            isEventUpdateModalOpen={isEventUpdateModalOpen}
            setIsEventUpdateModalOpen={setIsEventUpdateModalOpen}
         />
         <EventsPageView
            titleOff
            renderEventCard={(event) => (
               <ControlledEventCard
                  onInviteButtonClick={onInviteButtonClick}
                  onUpdateButtonClick={onUpdateButtonClick}
                  onDeleteButtonClick={onDeleteButtonClick}
                  event={event}
               />
            )}
            isLoading={isLoading}
            filters={filters}
            setFilters={setFilters}
            sorts={sorts}
            setSorts={setSorts}
            pagesToRender={pagesToRender}
            isDataEmpty={isDataEmpty}
            removeFromFilter={removeFromFilter}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            layoutClasses="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
         />
      </div>
   );
};

export default ProfileEventsPage;
