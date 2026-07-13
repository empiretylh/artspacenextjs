'use client';

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useGlobalSearch, type SearchArtwork } from "@/features/service/artspace/get-global-search";
import ArtworkCard from "@/components/app/artwork-card";
import UserSearchCard from "../components/user-search-card";
import { cn } from "@/lib/utils";
import type { Artwork } from "@/types";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/layout/empty-state";

// Helper to map search artwork to full artwork object
const mapToArtwork = (item: SearchArtwork, artistName?: string): Artwork => {
   return {
      id: item.id,
      title: item.title,
      image: item.image,
      price: item.price !== null ? String(item.price) : "0",
      year: item.year,
      original_width: item.original_width || 400,
      original_height: item.original_height || 400,
      hide_price: item.price === null,
      artist_name: artistName || "",
      is_liked: false,
      currency: {
         code: "USD",
         symbol: "$",
         name: "United States Dollar",
         numeric_code: "840",
      },
      category_name: "",
      category: { id: 0, name: "", image: "", slug: "" },
      genre: { id: 0, name: "", image: "", slug: "" },
      styles: [],
      description: "",
      visibility: "PUBLIC",
      dimensions: "",
      status: "AVAILABLE",
      current_owner_display: {} as any,
      created_at: "",
      updated_at: "",
      artist_profile: {} as any,
      artwork_styles: [],
   } as unknown as Artwork;
};

export default function SearchPage() {
   const searchParams = useSearchParams();
   const query = searchParams.get("search") || "";
   const t = useTranslations("Search");

   const [activeTab, setActiveTab] = React.useState("all");

   const { data, isLoading, error } = useGlobalSearch({
      query,
      limit: 10,
      topN: 4,
   });

   const artworks = data?.artworks ?? [];
   const artists = data?.artists ?? [];
   const galleries = data?.galleries ?? [];
   const collectors = data?.collectors ?? [];
   const buyers = data?.buyers ?? [];

   const totalCount =
      artworks.length +
      artists.length +
      galleries.length +
      collectors.length +
      buyers.length;

   const hasResults = totalCount > 0;

   // Reset tab on search query change
   React.useEffect(() => {
      setActiveTab("all");
   }, [query]);

   // Tab configurations
   const tabs = [
      { id: "all", label: t("all"), count: totalCount },
      { id: "artworks", label: t("artworks"), count: artworks.length },
      { id: "artists", label: t("artists"), count: artists.length },
      { id: "galleries", label: t("galleries"), count: galleries.length },
      { id: "collectors", label: t("collectors"), count: collectors.length },
      { id: "buyers", label: t("buyers"), count: buyers.length },
   ];

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Spinner className="size-8" />
            <p className="text-muted-foreground text-sm">Searching Myanmar Art Space...</p>
         </div>
      );
   }

   if (error) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-destructive font-semibold">An error occurred while searching.</p>
            <p className="text-muted-foreground text-sm mt-1">Please try again later.</p>
         </div>
      );
   }

    return (
       <div className="flex-grow transition-all duration-300 space-y-6">
          {/* Search Header */}
          <div className="space-y-2">
             <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
               {t("title")}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
               {query ? (
                  hasResults ? (
                     t("resultsCount", { count: totalCount }) + ` for "${query}"`
                  ) : (
                     t("noResults", { query })
                  )
               ) : (
                  t("searchPrompt")
               )}
            </p>
         </div>

         {query && hasResults && (
            <>
               {/* High-gravity Navigation Pills */}
               <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border/40">
                  {tabs.map((tab) => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                           "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-xs border border-transparent",
                           activeTab === tab.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-background hover:bg-muted border-border/70 text-foreground"
                        )}
                     >
                        {tab.label} ({tab.count})
                     </button>
                  ))}
               </div>

               {/* Tab Contents */}
               <div className="pt-2">
                  {/* --- ALL RESULTS TAB --- */}
                  {activeTab === "all" && (
                     <div className="space-y-12">
                        {/* Artworks Preview */}
                        {artworks.length > 0 && (
                           <div className="space-y-4">
                              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                                 <h2 className="text-lg font-bold font-display">{t("artworks")}</h2>
                                 <button
                                    onClick={() => setActiveTab("artworks")}
                                    className="text-xs font-semibold text-primary hover:underline"
                                 >
                                    View All ({artworks.length})
                                 </button>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-6 md:gap-y-8">
                                 {artworks.slice(0, 6).map((item) => (
                                    <ArtworkCard
                                       key={item.id}
                                       artwork={mapToArtwork(item)}
                                       className="w-full"
                                    />
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Artists Preview */}
                        {artists.length > 0 && (
                           <div className="space-y-4">
                              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                                 <h2 className="text-lg font-bold font-display">{t("artists")}</h2>
                                 <button
                                    onClick={() => setActiveTab("artists")}
                                    className="text-xs font-semibold text-primary hover:underline"
                                 >
                                    View All ({artists.length})
                                 </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                 {artists.slice(0, 4).map((user) => (
                                    <UserSearchCard
                                       key={user.id}
                                       user={user}
                                       type="artist"
                                    />
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Galleries Preview */}
                        {galleries.length > 0 && (
                           <div className="space-y-4">
                              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                                 <h2 className="text-lg font-bold font-display">{t("galleries")}</h2>
                                 <button
                                    onClick={() => setActiveTab("galleries")}
                                    className="text-xs font-semibold text-primary hover:underline"
                                 >
                                    View All ({galleries.length})
                                 </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                 {galleries.slice(0, 4).map((user) => (
                                    <UserSearchCard
                                       key={user.id}
                                       user={user}
                                       type="gallery"
                                    />
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Collectors Preview */}
                        {collectors.length > 0 && (
                           <div className="space-y-4">
                              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                                 <h2 className="text-lg font-bold font-display">{t("collectors")}</h2>
                                 <button
                                    onClick={() => setActiveTab("collectors")}
                                    className="text-xs font-semibold text-primary hover:underline"
                                 >
                                    View All ({collectors.length})
                                 </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                 {collectors.slice(0, 4).map((user) => (
                                    <UserSearchCard
                                       key={user.id}
                                       user={user}
                                       type="collector"
                                    />
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Buyers Preview */}
                        {buyers.length > 0 && (
                           <div className="space-y-4">
                              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                                 <h2 className="text-lg font-bold font-display">{t("buyers")}</h2>
                                 <button
                                    onClick={() => setActiveTab("buyers")}
                                    className="text-xs font-semibold text-primary hover:underline"
                                 >
                                    View All ({buyers.length})
                                 </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                 {buyers.slice(0, 4).map((user) => (
                                    <UserSearchCard
                                       key={user.id}
                                       user={user}
                                       type="buyer"
                                    />
                                 ))}
                              </div>
                           </div>
                        )}
                     </div>
                  )}

                  {/* --- ARTWORKS TAB --- */}
                  {activeTab === "artworks" && (
                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-6 md:gap-y-8">
                        {artworks.map((item) => (
                           <ArtworkCard
                              key={item.id}
                              artwork={mapToArtwork(item)}
                              className="w-full"
                           />
                        ))}
                     </div>
                  )}

                  {/* --- ARTISTS TAB --- */}
                  {activeTab === "artists" && (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {artists.map((user) => (
                           <UserSearchCard
                              key={user.id}
                              user={user}
                              type="artist"
                           />
                        ))}
                     </div>
                  )}

                  {/* --- GALLERIES TAB --- */}
                  {activeTab === "galleries" && (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {galleries.map((user) => (
                           <UserSearchCard
                              key={user.id}
                              user={user}
                              type="gallery"
                           />
                        ))}
                     </div>
                  )}

                  {/* --- COLLECTORS TAB --- */}
                  {activeTab === "collectors" && (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {collectors.map((user) => (
                           <UserSearchCard
                              key={user.id}
                              user={user}
                              type="collector"
                           />
                        ))}
                     </div>
                  )}

                  {/* --- BUYERS TAB --- */}
                  {activeTab === "buyers" && (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {buyers.map((user) => (
                           <UserSearchCard
                              key={user.id}
                              user={user}
                              type="buyer"
                           />
                        ))}
                     </div>
                  )}
               </div>
            </>
         )}

         {(!query || !hasResults) && (
            <div className="py-12">
               <EmptyState />
            </div>
         )}
      </div>
   );
}
