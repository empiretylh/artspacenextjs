import ArtworkCard from "@/components/app/artwork-card";
import { keepPreviousData } from "@tanstack/react-query";
import { useGetArtworks, useGetArtworksInfinite } from "../api/get-artworks";
import { Fragment, useState } from "react";
import MasonryCards from "@/features/artwork/components/masonry-cards";
import MasonryItem from "@/components/app/masonry-item";
import { Button } from "@/components/ui/button";

const ArtistArtworksList = () => {
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(10);

   const {
      isLoading,
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
   } = useGetArtworksInfinite({
      limit,
      queryConfig: {
         placeholderData: keepPreviousData,
      },
   });

   return (
      <div>
         {/* <div className="grid grid-cols-[repeat(auto-fill,1fr)] gap-x-2 auto-rows-[1px]">
            {artworks.map((artwork) => {
               return <MasonryItem key={artwork.id} artwork={artwork} />;
            })}
         </div> */}
         {data &&
            data.pages.map((page) => (
               <Fragment key={page.data.next}>
                  {isLoading ? (
                     <div className="text-center flex justify-center items-center h-full">
                        Loading artists...
                     </div>
                  ) : page.data.results.length === 0 ? (
                     <div className="text-center flex justify-center items-center h-full">
                        No artists found.
                     </div>
                  ) : (
                     <div className="grid grid-cols-[repeat(auto-fill,1fr)] gap-x-2 auto-rows-[1px]">
                        {page.data.results.map((artwork) => {
                           return (
                              <MasonryItem key={artwork.id} artwork={artwork} />
                           );
                        })}
                     </div>
                  )}
               </Fragment>
            ))}

         <div className="flex justify-center my-2">
            <div>
               <Button
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
               >
                  {isFetchingNextPage
                     ? "Loading more..."
                     : hasNextPage
                       ? "Load More"
                       : "Nothing more to load"}
               </Button>
            </div>
         </div>
      </div>
   );
};

export default ArtistArtworksList;
