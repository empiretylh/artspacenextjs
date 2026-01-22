// components/featured-collection.tsx

import type { Artwork } from "@/types";

export function FeaturedCollection({ artwork }: { artwork: Artwork }) {
   return (
      <div className="relative overflow-hidden rounded-xl">
         <img src={artwork.image} className="h-[420px] w-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
            <p className="text-xs uppercase text-white/80">Editor’s Pick</p>
            <h1 className="text-2xl font-semibold text-white">
               {artwork.title}
            </h1>
            <p className="text-sm text-white/80">{artwork.artist_name}</p>
         </div>
      </div>
   );
}
