import CollectorOverviewPage from "@/features/collectors/pages/collector-overview-page";
import { getCachedCollector } from "@/features/service/artspace/get-collector";
import { getCollectors } from "@/features/service/artspace/get-collectors";
import { Metadata, ResolvingMetadata } from "next";

export async function generateStaticParams() {
  const collectors = await getCollectors({ limit: 10 })

  return collectors.results.map((collector) => ({
    id: String(collector.id),
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
  const data = await getCachedCollector(id);

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

const CollectorDetailRoute = async () => {
  return <CollectorOverviewPage />
};

export default CollectorDetailRoute;
