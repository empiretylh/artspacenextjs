'use client'

import { useEffect, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import type { Artwork, ListApiResponse } from "@/types";
import type { AxiosResponse } from "axios";
import ArtworkCard from "@/components/app/artwork-card";
import RelatedArtworksListView from "./related-artwork-list-view";
import { useGetRelatedArtworksInfinite } from "@/features/service/artspace/get-related-artworks";
import { extractListItems } from "@/lib/utils";
import { useTranslations } from "next-intl";

const RelatedArtworkListContainer = ({ artwork }: { artwork: Artwork }) => {
   const t = useTranslations("Artwork.detail");
   const [oldData, setOldData] = useState<
      AxiosResponse<ListApiResponse<Artwork>, any>[]
   >([]);

   // Fetch Related Artworks via infinite scroll without modifying window URL
   const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } =
      useGetRelatedArtworksInfinite({
         artworkId: artwork.id,
         page: 1,
         limit: 10,
         queryConfig: { placeholderData: keepPreviousData },
      });

   useEffect(() => {
      if (!isLoading && data) setOldData(data.pages);
   }, [data, isLoading]);

   const pagesToRender = isLoading ? oldData : data?.pages || [];
   const firstPageArtworks = extractListItems<Artwork>(
      pagesToRender?.[0]?.data ?? pagesToRender?.[0]
   );
   const hasArtworks = firstPageArtworks.length > 0;

   if (!isLoading && !hasArtworks) {
      return null;
   }

   return (
      <div className="pt-10 border-t border-border/70 mt-14">
         {hasArtworks && (
            <h3 className="text-xl md:text-2xl font-display font-semibold mb-6 tracking-tight">
               {t("youMayAlsoLike")}
            </h3>
         )}
         <RelatedArtworksListView
            artworkCard={(artwork: Artwork) => (
               <ArtworkCard
                  className="w-full"
                  artwork={artwork}
               />
            )}
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
