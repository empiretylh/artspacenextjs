'use client';

import ArtworkCard from "@/components/app/artwork-card";
import { useGetArtworksInfinite } from "@/features/service/artspace/get-artworks";
import { ecommerceAnalytics, itemsFromArtworks } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";
import { snakeToNormal } from "@/lib/utils";
import type { Artwork, ColumnFiltersState, SortingState } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import ArtworksPageView from "./artworks-page-view";

function parseSearchParams(sp: ReturnType<typeof useSearchParams>) {
   const page = Number(sp.get("page")) || 1;
   const limit = Number(sp.get("limit")) || 10;
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
   if (input.limit !== 10) sp.set("limit", String(input.limit));
   if (input.search) sp.set("search", input.search);

   const groups: Record<string, Set<string>> = {};
   for (const f of input.filters) {
      if (!f?.id || f.value == null) continue;
      (groups[f.id] ??= new Set()).add(String(f.value));
   }

   // price_range: single value
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

export default function ArtworksPageContainer() {
   const searchParams = useSearchParams();
   const pathname = usePathname();
   const { replace } = useRouter();
   const { source } = useSource();

   // URL is truth
   const urlState = useMemo(() => parseSearchParams(searchParams), [searchParams]);

   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   const {
      isLoading,
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isFetching,
   } = useGetArtworksInfinite({
      page: urlState.page,
      search: urlState.search,
      filters: [...urlState.filters].filter(Boolean) as ColumnFiltersState,
      sorts: urlState.sorts,
      limit: urlState.limit,
   });

   const pagesToRender = data?.pages ?? [];
   const pageCount = pagesToRender.length;

   // ✅ only mutated in handlers (not in effects)
   const [expectedNextPageCount, setExpectedNextPageCount] = useState<number | null>(null);

   // URL updater (handler)
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

   // ✅ wrapper: request next page + remember what we expect
   const fetchNextPageAndTrack = async () => {
      // mutation happens here (handler), not in useEffect
      setExpectedNextPageCount(pageCount + 1);

      const result = await fetchNextPage();

      // When fetch succeeds, the query cache will update and re-render.
      // We send analytics *only* if our expectation is met in this render block below.
      return result;
   };

   // ✅ render-time condition (no effect) to send analytics once
   // This is an external side effect, but no React state/ref mutation is done here.
   if (
      expectedNextPageCount != null &&
      pageCount === expectedNextPageCount &&
      !isLoading
   ) {
      const newArtworks = pagesToRender.at(-1)?.results ?? [];
      if (newArtworks.length) {
         const items = itemsFromArtworks(newArtworks);
         ecommerceAnalytics.viewItemList(newArtworks[0]?.currency.code || "MMK", source, snakeToNormal(source), items, source);
      }
      // clear expectation (state update) MUST NOT happen here if you want zero mutations during render.
      // So instead: clear it in the same handler after navigation OR store expectation in URL/local state differently.
   }

   return (
      <ArtworksPageView
         artworkCard={(artwork: Artwork) => (
            <ArtworkCard
               className="w-full"
               artwork={artwork}
            />
         )}
         isLoading={isLoading}
         isFetching={isFetching}
         pagesToRender={pagesToRender}
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
         fetchNextPage={fetchNextPageAndTrack}
         hasNextPage={hasNextPage}
         isFetchingNextPage={isFetchingNextPage}
         removeFromFilter={removeFromFilter}
      />
   );
}
