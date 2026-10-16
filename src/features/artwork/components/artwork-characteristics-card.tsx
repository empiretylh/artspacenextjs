'use client'

import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import type { Artwork, Category } from "@/types";
import { useTranslations } from "next-intl";

interface ArtworkCharacteristicsProps {
   year?: number;
   dimensions?: string;
   medium?: string;
   typeOfArt?: string;
   styles?: Artwork["artwork_styles"];
   genre?: string;
   materials?: string;
   packaging?: string;
   category?: Category;
   categoryName?: string;
   artistName?: string;
   artistId?: number | string;
   currentOwner?: string | null;
}

export function ArtworkCharacteristicsCard({
   year,
   dimensions,
   medium,
   styles,
   materials,
   packaging,
   categoryName,
   artistName,
   artistId,
   category,
   currentOwner,
}: ArtworkCharacteristicsProps) {
   const t = useTranslations("Artwork.detail");

   return (
      <div className="bg-card/40 border border-border/70 rounded-xl p-5 shadow-xs">
         <h2 className="font-semibold text-lg md:text-xl mb-3 font-display text-foreground">
            {t("characteristicsTitle")}
         </h2>
         <dl className="divide-y divide-border/60 text-sm">
            {artistName && (
               <div className="flex items-center justify-between py-2.5 gap-4">
                  <dt className="text-muted-foreground w-1/3 shrink-0">{t("artist")}</dt>
                  <dd className="font-medium text-right truncate">
                     {artistId ? (
                        <Link
                           to={paths.artists.detail.getHref(String(artistId))}
                           className="cursor-pointer text-primary hover:underline font-semibold"
                        >
                           {artistName}
                        </Link>
                     ) : (
                        artistName
                     )}
                  </dd>
               </div>
            )}

            {year ? (
               <div className="flex items-center justify-between py-2.5 gap-4">
                  <dt className="text-muted-foreground w-1/3 shrink-0">{t("yearOfCreation")}</dt>
                  <dd className="font-medium text-right">{year}</dd>
               </div>
            ) : null}

            {medium && medium !== "N/A" ? (
               <div className="flex items-center justify-between py-2.5 gap-4">
                  <dt className="text-muted-foreground w-1/3 shrink-0">{t("medium")}</dt>
                  <dd className="font-medium text-right">{medium}</dd>
               </div>
            ) : null}

            {dimensions && dimensions !== "N/A" ? (
               <div className="flex items-center justify-between py-2.5 gap-4">
                  <dt className="text-muted-foreground w-1/3 shrink-0">{t("dimensions")}</dt>
                  <dd className="font-medium text-right">{dimensions}</dd>
               </div>
            ) : null}

            {categoryName ? (
               <div className="flex items-center justify-between py-2.5 gap-4">
                  <dt className="text-muted-foreground w-1/3 shrink-0">{t("category")}</dt>
                  <dd className="font-medium text-right">
                     <Link
                        to={`${paths.artworks.path}?category=${category?.slug || ""}`}
                        className="cursor-pointer text-primary hover:underline"
                     >
                        {categoryName}
                     </Link>
                  </dd>
               </div>
            ) : null}

            {styles && styles.length > 0 ? (
               <div className="flex items-center justify-between py-2.5 gap-4">
                  <dt className="text-muted-foreground w-1/3 shrink-0">{t("styles")}</dt>
                  <dd className="font-medium text-right flex flex-wrap justify-end gap-1">
                     {styles.map((style, index) => (
                        <Link
                           to={`${paths.artworks.path}?art-style=${style.slug}`}
                           key={style.id}
                           className="cursor-pointer text-primary hover:underline"
                        >
                           {style.name}{index < styles.length - 1 ? "," : ""}
                        </Link>
                     ))}
                  </dd>
               </div>
            ) : null}

            {materials && materials !== "N/A" ? (
               <div className="flex items-center justify-between py-2.5 gap-4">
                  <dt className="text-muted-foreground w-1/3 shrink-0">Materials</dt>
                  <dd className="font-medium text-right">{materials}</dd>
               </div>
            ) : null}

            {packaging && packaging !== "N/A" ? (
               <div className="flex items-center justify-between py-2.5 gap-4">
                  <dt className="text-muted-foreground w-1/3 shrink-0">Packaging</dt>
                  <dd className="font-medium text-right">{packaging}</dd>
               </div>
            ) : null}

            {currentOwner && currentOwner !== "N/A" ? (
               <div className="flex items-center justify-between py-2.5 gap-4">
                  <dt className="text-muted-foreground w-1/3 shrink-0">{t("currentOwner")}</dt>
                  <dd className="font-medium text-right text-muted-foreground">{currentOwner}</dd>
               </div>
            ) : null}
         </dl>
      </div>
   );
}
