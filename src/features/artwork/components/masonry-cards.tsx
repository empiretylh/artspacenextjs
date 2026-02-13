import MasonryItem from "../../../components/app/masonry-item";

const MasonryCards = ({ artworks }: { artworks: any[] }) => {
   return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-x-2 auto-rows-[1px]">
         {artworks.map((artwork) => {
            return <MasonryItem key={artwork.id} artwork={artwork} />;
         })}
      </div>
   );
};

export default MasonryCards;
