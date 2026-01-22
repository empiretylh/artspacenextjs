import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { User } from "@/types";
import type { AxiosResponse } from "axios";

export const getProfile = (): Promise<AxiosResponse<User>> => {
   return api.get(`/users/profile/me/`);
};

export const getProfileQueryOptions = () => {
   return queryOptions({
      queryKey: ["profile"],
      queryFn: () => getProfile(),
   });
};

type UseProfileOptions = {
   queryConfig?: QueryConfig<typeof getProfileQueryOptions>;
};

export const useGetProfile = ({ queryConfig }: UseProfileOptions = {}) => {
   return useQuery({
      ...getProfileQueryOptions(),
      ...queryConfig,
   });
};
