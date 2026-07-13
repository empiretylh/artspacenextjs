import { CollectionRow } from "../components/collection-row";

export default function CollectionsPage() {
   return (
      <section className="container mx-auto px-4 py-8 space-y-12">
         {/* Page Header */}
         <header className="space-y-2">
            <h1 className="text-3xl font-bold font-display tracking-tight">Arcade</h1>
            <p className="text-muted-foreground">
               Curated selections from artists and editors
            </p>
         </header>

         {/* Featured */}
         {/* <FeaturedCollection artwork={dummyArtworks[0]} /> */}

         {/* Rows */}
         <CollectionRow
            title="Myanmar Artspace Arcade"
            description="Hand-selected works by our curators"
         />

         {/* <CollectionRow title="Trending This Week" artworks={dummyArtworks} /> */}

         {/* <CollectionRow title="New & Noteworthy" artworks={dummyArtworks} /> */}
      </section>
   );
}
