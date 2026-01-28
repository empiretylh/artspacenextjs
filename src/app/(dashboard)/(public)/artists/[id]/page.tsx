import ArtistOverviewPage from "@/features/artist/pages/artist-overview-page";
import { getCachedArtist } from "@/features/service/artspace/get-artist";
import { getArtistsOg } from "@/features/service/artspace/get-artists";
import { getImage } from "@/lib/utils";
import { Metadata, ResolvingMetadata } from "next";

export async function generateStaticParams() {
  const artists = await getArtistsOg({ limit: 10 })

  return artists.results.map((artist) => ({
    id: String(artist.id),
  }))
}

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
  const data = await getCachedArtist(id);

  return {
    title: (data.first_name || '') + (data.last_name || ''),
    description: data.profile.about,
    openGraph: {
      images: [getImage(data.profile.profile_picture) || '/assets/profile-default.png'],
      title: (data.first_name || '') + (data.last_name || ''),
      description: data.profile.about,
    }
  }
}

const ArtistDetailRoute = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <ArtistOverviewPage />
};

export default ArtistDetailRoute;
