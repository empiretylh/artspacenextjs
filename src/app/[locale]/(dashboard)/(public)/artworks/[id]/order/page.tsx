import { getArtwork } from "@/features/service/artspace/get-artwork";
import { ArtworkOrderForm } from "@/features/orders/components/artwork-order-form";
import { notFound, redirect } from "next/navigation";
import React, { cache } from "react";
import { getQueryClient } from "@/lib/get-query-client";
import { queryKeys } from "@/config/query-keys";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getSession } from "@/lib/auth";
import { paths } from "@/config/paths";
import { setRequestLocale } from "next-intl/server";
import { getDeliveryCharges } from "@/features/orders/api/get-delivery-charges";

const getCachedArtwork = cache((id: string) => getArtwork({ artworkId: id }))

type Props = {
  params: Promise<{ locale: string; id: string }>
}

const ArtworkOrderRoute = async ({ params }: Props) => {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await getSession();

  if (!session?.user) {
    redirect(`/${locale}${paths.auth.login.getHref()}?redirectTo=/${locale}${paths.artworks.order.getHref(id)}`);
  }

  const queryClient = getQueryClient();

  try {
    const [artwork] = await Promise.all([
      getCachedArtwork(id),
      queryClient.prefetchQuery({
        queryKey: ["delivery-charges"],
        queryFn: getDeliveryCharges,
      }),
    ]);
    
    if (!artwork) {
      return notFound();
    }

    await queryClient.prefetchQuery({
      queryKey: queryKeys.artwork.detail(id),
      queryFn: () => artwork,
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="container">
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

