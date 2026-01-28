import GalleryOverviewPage from "@/features/gallery/pages/gallery-overview-page";
import { getCachedGallery } from "@/features/service/artspace/get-gallery";
import { getGalleries } from "@/features/service/artspace/get-galleries";
import { Metadata, ResolvingMetadata } from "next";

export async function generateStaticParams() {
  const galleries = await getGalleries({ limit: 10 })

  return galleries.results.map((gallery) => ({
    id: String(gallery.id),
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
  const data = await getCachedGallery(id);

  return {
    title: (data.first_name || '') + (data.last_name || ''),
    description: data.profile.about,
    openGraph: {
      images: [data.profile.profile_picture || '/assets/profile-default.png'],
      title: (data.first_name || '') + (data.last_name || ''),
      description: data.profile.about,
    }
  }
}

const GalleryDetailRoute = async () => {
  return <GalleryOverviewPage />
};

export default GalleryDetailRoute;
