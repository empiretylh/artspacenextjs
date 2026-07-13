import { SectionTitle } from "@/components/common";
import { GenresList } from "./genres-list";
import { queryKeys } from "@/config/query-keys";
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getHomeGenres } from "@/features/service/artspace/get-home-genres";
import { getQueryClient } from "@/lib/get-query-client";
import { getTranslations } from "next-intl/server";

export const GenreSection = async () => {
   const queryClient = getQueryClient();
   const t = await getTranslations("Home");

   await queryClient.prefetchQuery({
      queryKey: queryKeys.genre.home.list({ limit: 4 }),
      queryFn: () => getHomeGenres({ limit: 4 }),
   });

   return (
      <HydrationBoundary state={dehydrate(queryClient)} >
         <section>
            <div className="mb-4">
               <SectionTitle>{t("shopByGenre")}</SectionTitle>
            </div>
            <GenresList />
         </section>
      </HydrationBoundary>
   );
};
