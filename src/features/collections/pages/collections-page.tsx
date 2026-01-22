// app/collections/page.tsx (or pages/collections.tsx)

import { CollectionRow } from "../components/collection-row";
import { dummyArtworks } from "../data/dummy-artworks";

export default function CollectionsPage() {
   return (
      <main className="container mx-auto px-4 py-8 space-y-12">
         {/* Page Header */}
         <header className="space-y-2">
            <h1 className="text-3xl font-bold">Collections</h1>
            <p className="text-muted-foreground">
               Curated selections from artists and editors
            </p>
         </header>

         {/* Featured */}
         {/* <FeaturedCollection artwork={dummyArtworks[0]} /> */}

         {/* Rows */}
         <CollectionRow
            title="Myanmar Artspace Collections"
            description="Hand-selected works by our curators"
            artworks={dummyArtworks}
         />

         {/* <CollectionRow title="Trending This Week" artworks={dummyArtworks} /> */}

         {/* <CollectionRow title="New & Noteworthy" artworks={dummyArtworks} /> */}
      </main>
   );
}
