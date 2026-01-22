import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { FeaturedPhoto } from "@/types";
import type { AxiosResponse } from "axios";

export const getFeaturedPhotos = (): Promise<
   AxiosResponse<FeaturedPhoto[]>
> => {
   return api.get(`/users/featured-photos/`);
};

export const getFeaturedPhotosQueryOptions = () => {
   return queryOptions({
      queryKey: ["/uses/featured-photos/"],
      queryFn: () => getFeaturedPhotos(),
   });
};

type UseFeaturedPhotosOptions = {
   queryConfig?: QueryConfig<typeof getFeaturedPhotosQueryOptions>;
};

export const useGetFeaturedPhotos = ({
   queryConfig,
}: UseFeaturedPhotosOptions = {}) => {
   return useQuery({
      ...getFeaturedPhotosQueryOptions(),
      ...queryConfig,
   });
};
