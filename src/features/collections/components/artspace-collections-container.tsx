import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { keepPreviousData } from "@tanstack/react-query";
import type { Artwork, ListApiResponse } from "@/types";
import type { AxiosResponse } from "axios";
import ArtworkCard from "@/components/app/artwork-card";
import ArtspaceCollectionsView from "./artspace-collections-view";
import { useGetArtspaceCollectionsInfinite } from "@/features/service/artspace/get-artspace-collections";

const ArtspaceCollectionsContainer = () => {
   const [searchParams, setSearchParams] = useSearchParams();

   // State
   const [oldData, setOldData] = useState<
      AxiosResponse<ListApiResponse<{ id: number; artwork: Artwork }>, any>[]
   >([]);
   const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
   const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10);

   // Fetch Artworks
   const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } =
      useGetArtspaceCollectionsInfinite({
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
      setSearchParams(
         decodeURI(
            Object.entries(params)
               .map(([k, v]) => `${k}=${v}`)
               .join("&")
         ),
         { replace: true }
      );
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
         <ArtspaceCollectionsView
            artworkCard={(artwork: Artwork) => {
               return (
                  <ArtworkCard
                     variant="masonry"
                     className="inline-block w-full h-auto"
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

export default ArtspaceCollectionsContainer;
