import { queryKeys } from "@/config/query-keys";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export interface SearchArtwork {
   id: string;
   title: string;
   image: string;
   price: number | null;
   year: number;
   original_width: number;
   original_height: number;
}

export interface SearchUser {
   id: number;
   name: string;
   avatar: string | null;
   num_artworks: number;
   popular_artworks: SearchArtwork[];
}

export interface GlobalSearchResult {
   query: string;
   limit: number;
   artworks: SearchArtwork[];
   artists: SearchUser[];
   galleries: SearchUser[];
   collectors: SearchUser[];
   buyers: SearchUser[];
}

export const getGlobalSearch = async ({
   query,
   limit = 10,
   topN = 4,
}: {
   query: string;
   limit?: number;
   topN?: number;
}): Promise<GlobalSearchResult> => {
   if (!query) {
      return {
         query: "",
         limit,
         artworks: [],
         artists: [],
         galleries: [],
         collectors: [],
         buyers: [],
      };
   }
   const res = await api.get(`/search/global/${encodeURIComponent(query)}/`, {
      params: { limit, top_n: topN },
   });
   return res.data;
};

export const getGlobalSearchQueryOptions = (query: string, limit?: number, topN?: number) => {
   return queryOptions({
      queryKey: queryKeys.globalSearch.list(query, limit, topN),
      queryFn: () => getGlobalSearch({ query, limit, topN }),
      enabled: !!query,
   });
};

type UseGlobalSearchOptions = {
   query: string;
   limit?: number;
   topN?: number;
   queryConfig?: QueryConfig<typeof getGlobalSearch>;
};

export const useGlobalSearch = ({
   query,
   limit,
   topN,
   queryConfig,
}: UseGlobalSearchOptions) => {
   return useQuery({
      ...getGlobalSearchQueryOptions(query, limit, topN),
      ...queryConfig,
   });
};
