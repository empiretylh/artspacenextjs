import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { Artwork } from "@/types";
import type { MutationConfig } from "@/lib/react-query";
import { queryKeys } from "@/config/query-keys";
import { UserRouteType } from "./get-users";

export const followUser = ({
   userId,
   userType,
   following,
}: {
   userId: string;
   userType: UserRouteType;
   following: boolean;
}): Promise<Artwork> => {
   return api.post(`/users/follow/`, { id: userId, following });
};

type UseFollowUserOptions = {
   mutationConfig?: MutationConfig<typeof followUser>;
};

export const useFollowUser = ({
   mutationConfig,
}: UseFollowUserOptions = {}) => {
   const queryClient = useQueryClient();

   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: followUser,

      onSuccess: (...args) => {
         const variables = args[1];

         queryClient.invalidateQueries({
            queryKey: queryKeys.user.type.infinite(variables.userType),
         });

         queryClient.invalidateQueries({
            queryKey: queryKeys.user.type.list(variables.userType),
         });

         queryClient.invalidateQueries({
            queryKey: queryKeys.user.followed.status(
               variables.userId,
               variables.userType
            ),
         });

         onSuccess?.(...args);
      },

      ...restConfig,
   });
};
