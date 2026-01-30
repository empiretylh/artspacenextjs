import { SectionTitle } from "@/components/common";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getHomeCategories } from "@/features/service/artspace/get-home-categories";
import { getHomeStyles } from "@/features/service/artspace/get-home-styles";
import { getQueryClient } from "@/lib/get-query-client";
import CategoryAndStyleTab from "./category-and-style-tab";

export const CategoryAndStyleSection = async () => {
   const queryClient = getQueryClient();

   await queryClient.prefetchQuery({
      queryKey: queryKeys.category.home.list({ limit: 12 }),
      queryFn: () => getHomeCategories({ limit: 12 }),
   });

   await queryClient.prefetchQuery({
      queryKey: queryKeys.style.home.list({ limit: 12 }),
      queryFn: () => getHomeStyles({ limit: 12 }),
   });

   return (
      <section>
         <div className="mb-4">
            <SectionTitle>Shop Paintings by Category And Style</SectionTitle>
         </div>
         <HydrationBoundary state={dehydrate(queryClient)}>
            <CategoryAndStyleTab />
         </HydrationBoundary>
      </section>
   );
};
