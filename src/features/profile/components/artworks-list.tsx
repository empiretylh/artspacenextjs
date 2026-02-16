import { keepPreviousData } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import MasonryItem from "@/components/app/masonry-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetArtworksInfinite } from "@/features/service/artspace/get-artworks";

const ArtworksList = () => {
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
         <div
            className={cn(
               data && data?.pages[0].results.length > 0
                  ? "grid grid-cols-[repeat(auto-fill,1fr)] gap-x-2 auto-rows-[1px]"
                  : "h-[500px]"
            )}
         >
            {" "}
            {data &&
               data.pages.map((page) => (
                  <Fragment key={page.next ?? "page"}>
                     {isLoading ? (
                        <div className="text-center flex justify-center items-center h-full">
                           Loading artworks...
                        </div>
                     ) : page.results.length === 0 ? (
                        <div className="text-center flex justify-center items-center h-full">
                           No artworks found.
                        </div>
                     ) : (
                        <>
                           {page.results.map((artwork) => {
                              return (
                                 <MasonryItem
                                    key={artwork.id}
                                    artwork={artwork}
                                 />
                              );
                           })}
                        </>
                     )}
                  </Fragment>
               ))}
         </div>

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

export default ArtworksList;
