'use client'
import ArtworkDetailPage from "@/features/artwork/pages/artwork";
import { useParams } from "next/navigation";

const ArtworkDetailRoute = () => {
  const params = useParams<{ id: string }>();
  const id = params.id || "";
  return <ArtworkDetailPage id={id} />;
};

export default ArtworkDetailRoute;
