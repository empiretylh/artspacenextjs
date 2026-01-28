import { queryKeys } from "@/config/query-keys";
import ArtworkDetailPage from "@/features/artwork/pages/artwork";
import { getArtwork } from "@/features/service/artspace/get-artwork";
import { getArtworks } from "@/features/service/artspace/get-artworks";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";

export async function generateStaticParams() {
  const artworks = await getArtworks({ limit: 10 })

  return artworks.results.map((artwork) => ({
    id: artwork.id,
  }))
}

const getCachedArtwork = cache((id: string) => getArtwork({ artworkId: id }))

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  // fetch post information
  const data = await getCachedArtwork(id);

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      images: [data.image],
      title: data.title,
      description: data.description,
    }
  }
}

const ArtworkDetailRoute = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params;
  // const queryClient = getQueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: queryKeys.artwork.detail(id),
  //   queryFn: () => getCachedArtwork(id),
  // });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <ArtworkDetailPage id={id} />
    // </HydrationBoundary>
  );
};

export default ArtworkDetailRoute;
