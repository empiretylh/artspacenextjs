import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Post } from "@/types";
import { getPostsQueryOptions } from "./get-posts";

export { passwordRequirements } from "@/lib/zod-schema";

export const createPostInputSchema = z.object({
   title: z.string().min(2, {
      message: "Post title must be at least 2 characters.",
   }),
   body: z.string().min(10, {
      message: "Post body must be at least 10 characters.",
   }),
   userId: z.number(),
});

export type CreatePostInput = z.infer<typeof createPostInputSchema>;

export const createPost = ({
   data,
}: {
   data: CreatePostInput;
}): Promise<Post> => {
   return api.post(`/posts`, data);
};

type UseCreatePostOptions = {
   mutationConfig?: MutationConfig<typeof createPost>;
};

export const useCreatePost = ({
   mutationConfig,
}: UseCreatePostOptions = {}) => {
   const queryClient = useQueryClient();

   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: getPostsQueryOptions().queryKey,
         });
         onSuccess?.(...args);
      },
      ...restConfig,
      mutationFn: createPost,
   });
};
