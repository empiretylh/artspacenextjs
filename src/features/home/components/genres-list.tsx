'use client'
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import { getImage } from "@/lib/utils";
import { GenresListSkeleton } from "./genres-list-skeleton";
import { useGetHomeGenres } from "@/features/service/artspace/get-home-genres";

export const GenresList = () => {
   const genresQuery = useGetHomeGenres({
      limit: 4,
   });

   const genres = genresQuery.data?.data.results || [];

   if (genresQuery.isLoading) {
      return <GenresListSkeleton />;
   }

   return (
      <div className="grid grid-cols-2 xl:grid-cols-4 shrink-0 justify-center items-center gap-4 md:gap-6">
         {genres.slice(0, 12).map((cat) => (
            <Link
               key={cat.genre.slug}
               to={{
                  pathname: paths.artworks.path,
                  search: `?genre=${cat.genre.slug}`,
               }}
            >
               <div className="relative w-full max-w-2xl h-[170px] overflow-hidden rounded-2xl">
                  {/* Background Image */}
                  <img
                     src={getImage(cat.genre.image)}
                     alt="Landscape painting with mountains and river"
                     className="h-96 w-full object-cover"
                  />

                  {/* Overlay Content */}
                  <div className="absolute left-2 bottom-2 right-2 flex items-end p-2 bg-blend-color-burn bg-white/25 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-sm border border-white/30">
                     <h1 className="text-sm font-semibold truncate text-white">
                        {cat.genre.name}
                     </h1>
                  </div>
               </div>
            </Link>
         ))}
      </div>
   );
};
