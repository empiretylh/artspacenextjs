'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from "react";

import type { ColumnFiltersState, SortingState } from "@/types";

import { useGetUsersInfinite, UserRouteType } from "@/features/service/artspace/get-users";
import UsersPageView from "./users-page-view";

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

const UsersPageContainer = ({ userType }: { userType: UserRouteType }) => {
   // -----------------------------------------
   // State
   // -----------------------------------------
   const searchParams = useSearchParams();
   const pathname = usePathname();
   const { replace } = useRouter();

   const urlState = useMemo(() => parseSearchParams(searchParams), [searchParams]);

   // -----------------------------------------
   // Fetch
   // -----------------------------------------
   const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } =
      useGetUsersInfinite({
         userType: userType,
         search: urlState.search,
         filters: [...urlState.filters].filter(Boolean) as ColumnFiltersState,
         sorts: urlState.sorts,
         limit: urlState.limit,
      });

   const pagesToRender = data?.pages || [];

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

   const isDataEmpty = () => pagesToRender[0]?.results?.length <= 0;

   // -----------------------------------------
   // Render
   // -----------------------------------------
   return (
      <UsersPageView
         title={userType}
         isLoading={isLoading}
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
         pagesToRender={pagesToRender}
         isDataEmpty={isDataEmpty}
         removeFromFilter={removeFromFilter}
         fetchNextPage={fetchNextPage}
         hasNextPage={hasNextPage}
         isFetchingNextPage={isFetchingNextPage}
      />
   );
};

export default UsersPageContainer;
