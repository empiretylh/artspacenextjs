import { queryKeys } from "@/config/query-keys";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, User } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { UserRouteType } from "./get-users";
import { getUserPath } from "@/lib/utils";

export const getUserFollowStatus = async ({
  userId,
  userType,
}: {
  userId: string;
  userType: UserRouteType;
}): Promise<ApiResponse<User>> => {
  const res = await api.get(`/users/${getUserPath(userType)}/${userId}`);

  return res.data;
};

export const getUserFollowStatusQueryOptions = (userId: string, userType: UserRouteType) => {
  return queryOptions({
    queryKey: queryKeys.user.followed.status(userId, userType),
    queryFn: () => getUserFollowStatus({ userId, userType }),
  });
};

type UseArtistOptions = {
  userId: string;
  userType: UserRouteType;
  queryConfig?: QueryConfig<typeof getUserFollowStatusQueryOptions>;
};

export const useGetUserFollowStatus = ({ userId, userType, queryConfig }: UseArtistOptions) => {
  return useQuery({
    ...getUserFollowStatusQueryOptions(userId, userType),
    ...queryConfig,
    select: (data) => data.profile.is_following,
  });
};
