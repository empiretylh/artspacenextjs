import { getArtwork } from "@/features/service/artspace/get-artwork";
import { ArtworkOrderForm } from "@/features/orders/components/artwork-order-form";
import { notFound } from "next/navigation";
import React, { cache } from "react";
import { getQueryClient } from "@/lib/get-query-client";
import { queryKeys } from "@/config/query-keys";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const getCachedArtwork = cache((id: string) => getArtwork({ artworkId: id }))

type Props = {
  params: Promise<{ id: string }>
}

const ArtworkOrderRoute = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = getQueryClient();

  try {
    const artwork = await getCachedArtwork(id);
    
    if (!artwork) {
      return notFound();
    }

    await queryClient.prefetchQuery({
      queryKey: queryKeys.artwork.detail(id),
      queryFn: () => artwork,
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="container py-10">
          <ArtworkOrderForm artwork={artwork} />
        </div>
      </HydrationBoundary>
    );
  } catch (error) {
    console.error("Error fetching artwork for order:", error);
    return notFound();
  }
}

export default ArtworkOrderRoute
