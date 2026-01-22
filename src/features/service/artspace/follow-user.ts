import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { Artwork } from "@/types";
import type { MutationConfig } from "@/lib/react-query";
import { queryKeys } from "@/config/query-keys";

export const followUser = ({
   userId,
   userType,
   following,
}: {
   userId: string;
   userType: string;
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

         switch (variables.userType) {
            case "ARTIST": {
               // detail page
               queryClient.invalidateQueries({
                  queryKey: queryKeys.artist.detail(variables.userId),
               });

               // all artist lists (list + infinite)
               queryClient.invalidateQueries({
                  queryKey: queryKeys.artist.all,
               });

               break;
            }

            case "COLLECTOR": {
               queryClient.invalidateQueries({
                  queryKey: queryKeys.collector.detail(variables.userId),
               });

               queryClient.invalidateQueries({
                  queryKey: queryKeys.collector.all,
               });

               break;
            }

            case "GALLERY": {
               queryClient.invalidateQueries({
                  queryKey: queryKeys.gallery.detail(variables.userId),
               });

               queryClient.invalidateQueries({
                  queryKey: queryKeys.gallery.all,
               });

               break;
            }
         }

         onSuccess?.(...args);
      },

      ...restConfig,
   });
};
