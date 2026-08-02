import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, User } from "@/types";
import { queryKeys } from "@/config/query-keys";
import { cache } from "react";
import { useAuth } from "@/features/auth/store";
import { UserRouteType } from "./get-users";
import { getUserPath } from "@/lib/utils";

export const getCachedUser = cache((id: string, userType: UserRouteType) => getUser({ userId: id, userType }))

export const getUser = async ({
  userId,
  userType,
}: {
  userId: string;
  userType?: UserRouteType;
}): Promise<ApiResponse<User>> => {

  const res = await api.get(`/users/profile/public/${userId}/`);

  return res.data;
};

export const getUserQueryOptions = (userId: string, userType: UserRouteType) => {
  return queryOptions({
    queryKey: queryKeys.user.followed.status(userId, userType),
    queryFn: () => getUser({ userId, userType }),
  });
};

type UseArtistOptions = {
  userId: string;
  userType: UserRouteType;
  queryConfig?: QueryConfig<typeof getUserQueryOptions>;
};

export const useGetUser = ({ userId, userType, queryConfig }: UseArtistOptions) => {
  const { accessToken } = useAuth.getState();

  return useQuery({
    ...getUserQueryOptions(userId, userType),
    ...queryConfig,
    select: (data) => data.profile.is_following,
    enabled: queryConfig?.enabled ? queryConfig.enabled && (accessToken === null || !!accessToken) : (accessToken === null || !!accessToken)
  });
};
