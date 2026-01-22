import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";

import type { MutationConfig } from "@/lib/react-query";
import type { ApiResponse, Post } from "@/types";
import { getPostQueryOptions } from "./get-post";
import { getPostsQueryOptions } from "./get-posts";

export const updatePostInputSchema = z.object({
   title: z.string().min(1, "Post name is required"),
   body: z.string().min(1, "Body is required"),
});

export type UpdatePostInput = z.infer<typeof updatePostInputSchema>;

export const updatePost = ({
   data,
   postId,
}: {
   data: UpdatePostInput;
   postId: string;
}): Promise<ApiResponse<Post>> => {
   return api.put(`/posts/${postId}`, data);
};

type UseUpdatePostOptions = {
   mutationConfig?: MutationConfig<typeof updatePost>;
};

export const useUpdatePost = ({
   mutationConfig,
}: UseUpdatePostOptions = {}) => {
   const queryClient = useQueryClient();

   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      onSuccess: (data, ...args) => {
         queryClient.refetchQueries({
            queryKey: getPostQueryOptions(String(data.data.id)).queryKey,
         });
         queryClient.refetchQueries({
            queryKey: getPostsQueryOptions().queryKey,
         });
         onSuccess?.(data, ...args);
      },
      ...restConfig,
      mutationFn: updatePost,
   });
};
