import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { Artwork } from "@/types";
import type { MutationConfig } from "@/lib/react-query";
import { queryKeys } from "@/config/query-keys";

export const blockUser = ({
   userId,
   userType,
}: {
   userId: string;
   userType: string;
}): Promise<Artwork> => {
   return api.post(`/reports/users/${userId}/block/`);
};

type UseBlockUserOptions = {
   mutationConfig?: MutationConfig<typeof blockUser>;
};

export const useBlockUser = ({ mutationConfig }: UseBlockUserOptions = {}) => {
   const queryClient = useQueryClient();

   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: blockUser,

      onSuccess: (...args) => {
         const variables = args[1];

         queryClient.invalidateQueries({
            queryKey: queryKeys.user.blocked.all,
         });

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

            case "COLLECTOR":
            case "BUYER": {
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
