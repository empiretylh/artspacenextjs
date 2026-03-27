'use client'
import { useMemo, useState } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import type { Artwork, ColumnFiltersState, SortingState } from "@/types";
import ArtworksPageView from "@/features/artwork/components/artworks-page-view";
import ArtworkCard from "@/components/app/artwork-card";
import ArtworkUpdateModal from "@/features/artwork/components/artwork-update-modal";
import NotFound from "@/components/layout/not-found";
import { useGetLikedArtworksByUserIdInfinite } from "@/features/service/artspace/get-liked-artworks-by-user-id";
import { useProfileUser } from "@/components/providers/profile-user-provider";

type ControlledArtworkCardProps = {
   artwork: Artwork;
};

const ControlledArtworkCard: React.FC<ControlledArtworkCardProps> = ({
   artwork,
}) => {
   return (
      <div className="relative group inline-block break-inside-avoid mb-4 max-w-sm w-full">
         {/* Hover Buttons */}
         <ArtworkCard
            variant="masonry"
            className="inline-block w-full h-auto"
            artwork={artwork}
         />
      </div>
   );
};

function parseSearchParams(sp: ReturnType<typeof useSearchParams>) {
   const page = Number(sp.get("page")) || 1;
   const limit = Number(sp.get("limit")) || 12;
   const search = sp.get("search") || "";

   const filters: ColumnFiltersState = [];
   sp.forEach((value, key) => {
      if (!["page", "limit", "search", "sort"].includes(key)) {
         if (key === "price_range") {
            if (value) filters.push({ id: key, value });
         } else {
            String(value)
               .split(",")
               .filter(Boolean)
               .forEach((v) => filters.push({ id: key, value: v }));
         }
      }
   });

   const sorts: SortingState = [];
   const sortParam = sp.get("sort");
   if (sortParam) {
      const [id, order] = sortParam.split("-");
      if (id) sorts.push({ id, desc: order === "desc" });
   }

   return { page, limit, search, filters, sorts };
}

function buildSearchParams(input: {
   page: number;
   limit: number;
   search: string;
   filters: ColumnFiltersState;
   sorts: SortingState;
}) {
   const sp = new URLSearchParams();

   if (input.page !== 1) sp.set("page", String(input.page));
   if (input.limit !== 12) sp.set("limit", String(input.limit));
   if (input.search) sp.set("search", input.search);

   const groups: Record<string, Set<string>> = {};
   for (const f of input.filters) {
      if (!f?.id || f.value == null) continue;
      (groups[f.id] ??= new Set()).add(String(f.value));
   }

   if (input.filters.some((f) => f.id === "price_range")) {
      const last = input.filters.filter((f) => f.id === "price_range").at(-1);
      if (last?.value != null) groups["price_range"] = new Set([String(last.value)]);
   }

   for (const [key, set] of Object.entries(groups)) {
      const values = Array.from(set);
      sp.set(key, key === "price_range" ? (values[0] ?? "") : values.join(","));
   }

   if (input.sorts.length) {
      const s = input.sorts[0];
      sp.set("sort", `${s.id}-${s.desc ? "desc" : "asc"}`);
   }

   return sp;
}

const ArtworksPageContainer = () => {
   const searchParams = useSearchParams();
   const pathname = usePathname();
   const { replace } = useRouter();
   const { data: user } = useProfileUser();

   const urlState = useMemo(() => parseSearchParams(searchParams), [searchParams]);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   const [isArtworkUpdateModalOpen, setIsArtworkUpdateModalOpen] =
      useState(false);

   const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

   // Fetch Artworks
   const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } =
      useGetLikedArtworksByUserIdInfinite({
         userId: String(user?.id),
         page: urlState.page,
         search: urlState.search,
         filters: [...urlState.filters].filter(Boolean) as ColumnFiltersState,
         sorts: urlState.sorts,
         limit: urlState.limit,
      });

   const updateUrl = (next: Partial<typeof urlState>) => {
      const merged = {
         page: next.page ?? urlState.page,
         limit: next.limit ?? urlState.limit,
         search: next.search ?? urlState.search,
         filters: next.filters ?? urlState.filters,
         sorts: next.sorts ?? urlState.sorts,
      };
      const sp = buildSearchParams(merged);
      const nextUrl = sp.toString() ? `${pathname}?${sp.toString()}` : pathname;
      replace(nextUrl);
   };

   const removeFromFilter = (filterId: string, key: string) => {
      const nextFilters = urlState.filters.filter((f) =>
         f.id === filterId ? String(f.value) !== String(key) : true
      );
      updateUrl({ filters: nextFilters, page: 1 });
   };

   if (!user) {
      return <NotFound />;
   }

   return (
      <>
         <ArtworksPageView
            title="Liked Artworks"
            isLoading={isLoading}
            pagesToRender={data?.pages || []}
            filters={urlState.filters}
            setFilters={(next) => {
               const resolved =
                  typeof next === "function"
                     ? (next as (prev: ColumnFiltersState) => ColumnFiltersState)(urlState.filters)
                     : next;

               updateUrl({ filters: resolved, page: 1 });
            }}
            sorts={urlState.sorts}
            setSorts={(next) => updateUrl({ sorts: next, page: 1 })}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            removeFromFilter={removeFromFilter}
            artworkCard={(artwork) => {
               return <ControlledArtworkCard artwork={artwork} />;
            }}
            options={{ enableFilters: false, enableSorting: false }}
         />
         <ArtworkUpdateModal
            artwork={selectedArtwork}
            isArtworkUpdateModalOpen={isArtworkUpdateModalOpen}
            setIsArtworkUpdateModalOpen={setIsArtworkUpdateModalOpen}
         />
      </>
   );
};

export default ArtworksPageContainer;
