'use client'
import { useEffect, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import type { Artwork, ListApiResponse } from "@/types";
import type { AxiosResponse } from "axios";
import ArtworkCard from "@/components/app/artwork-card";
import RelatedArtworksListView from "./related-artwork-list-view";
import { useGetRelatedArtworksInfinite } from "@/features/service/artspace/get-related-artworks";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

const RelatedArtworkListContainer = ({ artwork }: { artwork: Artwork }) => {
   const searchParams = useSearchParams();
   const pathname = usePathname();
   const { replace } = useRouter();

   // State
   const [oldData, setOldData] = useState<
      AxiosResponse<ListApiResponse<Artwork>, any>[]
   >([]);
   const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
   const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10);

   // Fetch Artworks
   const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } =
      useGetRelatedArtworksInfinite({
         artworkId: artwork.id,
         page,
         search: searchParams.get("search") || "",
         limit,
         queryConfig: { placeholderData: keepPreviousData },
      });

   useEffect(() => {
      if (!isLoading && data) setOldData(data.pages);
   }, [data, isLoading]);

   const pagesToRender = isLoading ? oldData : data?.pages || [];

   const buildParams = () => {
      const params: Record<string, string> = {};
      if (page && page !== 1) params.page = page.toString();
      if (limit && limit !== 10) params.limit = limit.toString();

      return params;
   };

   // Update URL when state changes
   useEffect(() => {
      const params = buildParams();
      // setSearchParams(
      //    decodeURI(
      //       Object.entries(params)
      //          .map(([k, v]) => `${k}=${v}`)
      //          .join("&")
      //    ),
      //    { replace: true }
      // );
      replace(`${pathname}?${decodeURI(
         Object.entries(params)
            .map(([k, v]) => `${k}=${v}`)
            .join("&")
      )}`);
   }, [page, limit]);

   // Parse URL on mount
   useEffect(() => {
      const newPage = Number(searchParams.get("page")) || 1;
      const newLimit = Number(searchParams.get("limit")) || 10;

      setPage(newPage);
      setLimit(newLimit);
   }, []);

   return (
      <div>
         {pagesToRender.length > 0 && (
            <h3 className="text-2xl font-display font-bold my-4">
               You may also like
            </h3>
         )}
         <RelatedArtworksListView
            artworkCard={(artwork: Artwork) => {
               return (
                  <ArtworkCard
                     className="w-full"
                     artwork={artwork}
                  />
               );
            }}
            isLoading={isLoading}
            pagesToRender={pagesToRender}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
         />
      </div>
   );
};

export default RelatedArtworkListContainer;
