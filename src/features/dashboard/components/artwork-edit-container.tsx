import { useGetArtwork } from "../api/get-artwork";
import { ArtworkEditForm } from "./artwork-edit-form";

const ArtworkEditContainer = ({ artworkId }: { artworkId: string }) => {
   const artworkQuery = useGetArtwork({
      artworkId,
   });
   const artwork = artworkQuery.data?.data ?? null;

   if (artworkQuery.isLoading) return <div>Loading...</div>;

   if (artwork) return <ArtworkEditForm artwork={artwork} />;
};

export default ArtworkEditContainer;
