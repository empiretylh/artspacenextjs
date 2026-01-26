import { SectionTitle } from "@/components/common";
import { GenresList } from "./genres-list";
import { queryKeys } from "@/config/query-keys";
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getHomeGenres } from "@/features/service/artspace/get-home-genres";
import { getQueryClient } from "@/lib/get-query-client";

export const GenreSection = async () => {
   const queryClient = getQueryClient();

   queryClient.prefetchQuery({
      queryKey: queryKeys.genre.list({ limit: 4 }),
      queryFn: () => getHomeGenres({ limit: 4 }),
   });

   return (
      <HydrationBoundary state={dehydrate(queryClient)} >
         <section>
            <div className="mb-4">
               <SectionTitle>Shop Paintings by Genre</SectionTitle>
            </div>
            <GenresList />
         </section>
      </HydrationBoundary>
   );
};
