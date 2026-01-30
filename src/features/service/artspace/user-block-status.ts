import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, User } from "@/types";
import { queryKeys } from "@/config/query-keys";
import { cache } from "react";
import { useAuth } from "@/features/auth/store";
import { UserRouteType } from "./get-users";
import { getUserPath } from "@/lib/utils";

export const getUserBlockStatus = async ({
  userId,
  userType,
}: {
  userId: string;
  userType: UserRouteType;
}): Promise<ApiResponse<User>> => {
  const res = await api.get(`/users/${getUserPath(userType)}/${userId}`);

  return res.data;
};

export const getUserBlockStatusQueryOptions = (userId: string, userType: UserRouteType) => {
  return queryOptions({
    queryKey: queryKeys.user.blocked.status(userId, userType),
    queryFn: () => getUserBlockStatus({ userId, userType }),
  });
};

type UseArtistOptions = {
  userId: string;
  userType: UserRouteType;
  queryConfig?: QueryConfig<typeof getUserBlockStatusQueryOptions>;
};

export const useGetUserBlockStatus = ({ userId, userType, queryConfig }: UseArtistOptions) => {
  const { accessToken } = useAuth.getState();

  return useQuery({
    ...getUserBlockStatusQueryOptions(userId, userType),
    ...queryConfig,
    select: (data) => data.profile.isBlocked,
    enabled: queryConfig?.enabled ? queryConfig.enabled && (accessToken === null || !!accessToken) : (accessToken === null || !!accessToken)
  });
};
