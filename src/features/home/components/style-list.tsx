'use client'
import { Skeleton } from "@/components/ui/skeleton";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import { getImage } from "@/lib/utils";
import Image from "@/components/common/image";
import { useGetHomeStyles } from "@/features/service/artspace/get-home-styles";

export const StylesList = () => {
   const stylesQuery = useGetHomeStyles({ limit: 12 });
   const styles = stylesQuery.data?.results || [];
   const isLoading = stylesQuery.isLoading;

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
            : styles.slice(0, 12).map((style) => (
               <Link
                  key={style.style.slug}
                  to={{
                     pathname: paths.artworks.path,
                     search: `?art-style=${style.style.slug}`,
                  }}
               >
                  <div className="relative w-full aspect-square max-w-2xl overflow-hidden rounded-2xl">
                     <Image
                        src={getImage(style.style.image)}
                        alt={style.style.name}
                        className="w-full rounded-2xl"
                     />

                     <div className="absolute left-2 bottom-2 right-2 flex items-end p-2 bg-blend-color-burn bg-white/25 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-sm border border-white/30">
                        <h1 className="text-sm font-semibold truncate text-white">
                           {style.style.name}
                        </h1>
                     </div>
                  </div>
               </Link>
            ))}
      </div>
   );
};
