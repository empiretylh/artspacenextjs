import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import type { Artwork, Category } from "@/types";
import { useTranslations } from "next-intl";

interface ArtworkCharacteristicsProps {
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
   artistName?: string;
   currentOwner?: string | null;
}

export function ArtworkCharacteristicsCard({
   year,
   dimensions,
   medium,
   typeOfArt,
   styles,
   genre,
   materials,
   packaging,
   categoryName,
   artistName,
   category,
   currentOwner = "N/A",
}: ArtworkCharacteristicsProps) {
   const t = useTranslations("Artwork.detail");

   return (
      <div>
         <h2 className="font-bold text-xl mb-2 font-display">
            {t("characteristicsTitle")}
         </h2>
         <dl className="space-y-2 text-sm">
            <div className="flex border-b border-border gap-2 py-2">
               <dt className="w-1/2">{t("yearOfCreation")}</dt>
               <dd className="font-medium">{year}</dd>
            </div>

            <div className="flex border-b border-border gap-2 py-2">
               <dt className="w-1/2">{t("dimensions")}</dt>
               <dd className="font-medium">{dimensions}</dd>
            </div>

            <div className="flex border-b border-border gap-2 py-2">
               <dt className="w-1/2">{t("medium")}</dt>
               <dd className="font-medium">{medium}</dd>
            </div>

            <div className="flex border-b border-border gap-2 py-2">
               <dt className="w-1/2">{t("currentOwner")}</dt>
               <dd className="font-medium">{currentOwner ?? "N/A"}</dd>
            </div>

            <div className="flex border-b border-border gap-2 py-2">
               <dt className="w-1/2">{t("artist")}</dt>
               <dd className="font-medium">{artistName ?? "N/A"}</dd>
            </div>

            <div className="flex border-b gap-2 py-2">
               <dt className="w-1/2">{t("category")}</dt>
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
                  <dt className="w-1/2">{t("styles")}</dt>
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
         </dl>
      </div>
   );
}
