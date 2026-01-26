import { SectionTitle } from "@/components/common";
import { CategoriesList } from "./categories-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StylesList } from "./style-list";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getHomeCategories } from "@/features/service/artspace/get-home-categories";
import { getHomeStyles } from "@/features/service/artspace/get-home-styles";

export const CategoryAndStyleSection = async () => {
   const queryClient = new QueryClient();

   await queryClient.prefetchQuery({
      queryKey: queryKeys.category.home.list({ limit: 12 }),
      queryFn: () => getHomeCategories({ limit: 12 }),
   });

   await queryClient.prefetchQuery({
      queryKey: queryKeys.style.list({ limit: 12 }),
      queryFn: () => getHomeStyles({ limit: 12 }),
   });

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <section>
            <div className="mb-4">
               <SectionTitle>Shop Paintings by Category And Style</SectionTitle>
            </div>
            <Tabs defaultValue="category">
               <TabsList>
                  <TabsTrigger value="category">Category</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
               </TabsList>
               <TabsContent value="category">
                  <CategoriesList />
               </TabsContent>
               <TabsContent value="style">
                  <StylesList />
               </TabsContent>
            </Tabs>
         </section>
      </HydrationBoundary>
   );
};
