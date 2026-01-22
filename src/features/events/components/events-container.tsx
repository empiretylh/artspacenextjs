'use client'
import { useEventsListInfinite } from "../hooks/use-events-list-infinite-hook";
import { EventSmallCard } from "./event-small-card";
import EventsPageView from "./events-page-view";

const EventsPageContainer = () => {
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

   return (
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
      />
   );
};

export default EventsPageContainer;
