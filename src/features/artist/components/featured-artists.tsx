'use client'
import { useGetArtists } from "@/features/service/artspace/get-artists";
import UserListItem from "../../../components/app/user-list-item";
import UserListItemSkeleton from "../../../components/app/user-list-item-skeleton";

const FeaturedArtists = () => {
   const artistQuery = useGetArtists({
      limit: 4,
   });

   const artists = artistQuery.data?.data?.results ?? [];

   return (
      <div>
         <h2 className="font-display text-xl font-bold mb-2">
            Featured Artists
         </h2>

         <div className="grid grid-cols-1 gap-2">
            {artistQuery.isLoading
               ? Array.from({ length: 4 }).map((_, index) => (
                  <UserListItemSkeleton key={index} />
               ))
               : artists.map((artist, index) => (
                  <UserListItem
                     key={index}
                     user={artist}
                     className="max-w-[calc(var(--sidebar-width)-28px)]  md:max-w-[calc(var(--sidebar-width)-48px)]"
                  />
               ))}
         </div>
      </div>
   );
};

export default FeaturedArtists;
