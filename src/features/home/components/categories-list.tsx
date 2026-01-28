'use client'
import Image from "@/components/common/image"; // use your reusable Image component
import Link from "@/components/common/link";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/config/paths";
import { queryKeys } from "@/config/query-keys";
import { getHomeCategories } from "@/features/service/artspace/get-home-categories";
import { getImage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const CategoriesList = () => {
   const categoriesQuery = useQuery({
      queryKey: queryKeys.category.home.list({ limit: 12 }),
      queryFn: () => getHomeCategories({ limit: 12 }),
   })

   const categories = categoriesQuery.data?.results || [];
   const isLoading = categoriesQuery.isLoading;

   const skeletons = Array.from({ length: 12 });

   return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 shrink-0 justify-center items-center gap-4 md:gap-6">
         {isLoading
            ? skeletons.map((_, index) => (
               <div
                  key={index}
                  className="relative w-full h-[142px] max-w-2xl overflow-hidden rounded-2xl"
               >
                  <Skeleton className="h-full w-full rounded-2xl" />
                  <div className="absolute left-2 bottom-2 right-2 p-2 rounded-xl">
                     <Skeleton className="h-4 w-1/2" />
                  </div>
               </div>
            ))
            : categories.slice(0, 12).map((cat) => (
               <Link
                  key={cat.category.slug}
                  to={{
                     pathname: paths.artworks.path,
                     search: `?category=${cat.category.slug}`,
                  }}
               >
                  <div className="relative w-full aspect-square max-w-2xl overflow-hidden rounded-2xl">
                     <Image
                        src={getImage(cat.category.image)}
                        alt={cat.category.name}
                        className="aspect-square w-full rounded-2xl"
                     />

                     <div className="absolute left-2 bottom-2 right-2 flex items-end p-2 bg-blend-color-burn bg-white/25 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-sm border border-white/30">
                        <h1 className="text-sm font-semibold text-white">
                           {cat.category.name}
                        </h1>
                     </div>
                  </div>
               </Link>
            ))}
      </div>
   );
};
