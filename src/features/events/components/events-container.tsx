'use client'
import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/store";
import { useEventsListInfinite } from "../hooks/use-events-list-infinite-hook";
import { EventSmallCard } from "./event-small-card";
import EventsPageView from "./events-page-view";
import EventCreateModal from "./event-create-modal";

const EventsPageContainer = () => {
   const [isEventCreateModalOpen, setIsEventCreateModalOpen] = useState(false);
   const user = useAuth((state) => state.user);
   const t = useTranslations("Events");

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
   } = useEventsListInfinite();

   const isSignedIn = Boolean(user && user.id);

   return (
      <>
         <EventsPageView
            isLoading={isLoading}
            renderEventCard={(event) => <EventSmallCard event={event} />}
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
            headerAction={
               isSignedIn ? (
                  <Button
                     onClick={() => setIsEventCreateModalOpen(true)}
                     className="rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-xs flex items-center gap-1.5 select-none cursor-pointer h-9 px-4"
                  >
                     <Plus className="h-4 w-4 shrink-0" />
                     <span>{t("createEvent")}</span>
                  </Button>
               ) : null
            }
         />

         {isSignedIn && (
            <EventCreateModal
               isEventCreateModalOpen={isEventCreateModalOpen}
               setIsEventCreateModalOpen={setIsEventCreateModalOpen}
            />
         )}
      </>
   );
};

export default EventsPageContainer;
