import ArtworkCard from "../../../components/app/artwork-card";

const MasonryCards = ({ artworks }: { artworks: any[] }) => {
   return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
         {artworks.map((artwork) => {
            return (
               <div key={artwork.id}>
                  <ArtworkCard artwork={artwork} className="w-full" />
               </div>
            );
         })}
      </div>
   );
};

export default MasonryCards;
