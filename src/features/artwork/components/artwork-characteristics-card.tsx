import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import type { Artwork, Category } from "@/types";

interface ArtworkCharacteristicsProps {
   title: string;
   year: number;
   dimensions: string;
   medium: string;
   typeOfArt?: string;
   styles?: Artwork["artwork_styles"];
   genre?: string;
   materials?: string;
   packaging?: string;
   category?: Category;
   categoryName?: string;
   currentOwner?: string | null;
}

export function ArtworkCharacteristicsCard({
   title,
   year,
   dimensions,
   medium,
   typeOfArt,
   styles,
   genre,
   materials,
   packaging,
   categoryName,
   category,
   currentOwner = "N/A",
}: ArtworkCharacteristicsProps) {
   return (
      <div>
         <h2 className="font-bold text-lg mb-2">
            Characteristics of the Painting "{title}"{" "}
         </h2>
         <dl className="space-y-2 text-sm">
            <div className="flex border-b border-border gap-2 py-2">
               <dt className="w-1/2">Year of Creation</dt>
               <dd className="font-medium">{year}</dd>
            </div>

            <div className="flex border-b border-border gap-2 py-2">
               <dt className="w-1/2">Dimensions</dt>
               <dd className="font-medium">{dimensions}</dd>
            </div>

            <div className="flex border-b border-border gap-2 py-2">
               <dt className="w-1/2">Medium</dt>
               <dd className="font-medium">{medium}</dd>
            </div>

            <div className="flex border-b border-border gap-2 py-2">
               <dt className="w-1/2">Current owner</dt>
               <dd className="font-medium">{currentOwner ?? "N/A"}</dd>
            </div>

            <div className="flex border-b gap-2 py-2">
               <dt className="w-1/2">Category</dt>
               <dd className="font-medium">
                  <Link
                     to={paths.artworks.path + `?category=${category?.slug}`}
                     className="cursor-pointer underline text-primary"
                  >
                     {categoryName}
                  </Link>
               </dd>
            </div>

            {styles && (
               <div className="flex gap-2 py-2">
                  <dt className="w-1/2">Styles</dt>
                  <dd className="font-medium">
                     {styles?.map((style, index) => (
                        <Link
                           to={paths.artworks.path + `?art-style=${style.slug}`}
                           key={style.id}
                           className="cursor-pointer underline mr-1 text-primary"
                        >
                           {style.name} {index < styles.length - 1 ? "," : ""}
                        </Link>
                     ))}
                  </dd>
               </div>
            )}
            {/* 
               <div className="flex justify-between border-b border-border pb-1">
                  <dt className="text-muted-foreground">Type of Art</dt>
                  <dd className="font-medium">{typeOfArt}</dd>
               </div>

               <div className="flex justify-between border-b border-border pb-1">
                  <dt className="text-muted-foreground">Style</dt>
                  <dd className="font-medium">{style}</dd>
               </div>

               <div className="flex justify-between border-b border-border pb-1">
                  <dt className="text-muted-foreground">Genre</dt>
                  <dd className="font-medium">{genre}</dd>
               </div>

               <div className="flex justify-between border-b border-border pb-1">
                  <dt className="text-muted-foreground">Materials</dt>
                  <dd className="font-medium">{materials}</dd>
               </div>

               <div className="flex justify-between">
                  <dt className="text-muted-foreground">Packaging</dt>
                  <dd className="font-medium">{packaging}</dd>
               </div> */}
         </dl>
      </div>
   );
}
