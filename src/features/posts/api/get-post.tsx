import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, Post } from "@/types";

export const getPost = ({
   postId,
}: {
   postId: string;
}): Promise<ApiResponse<Post>> => {
   return api.get(`/posts/${postId}`).then((res) => res.data);
};

export const getPostQueryOptions = (postId: string) => {
   return queryOptions({
      queryKey: ["posts", postId],
      queryFn: () => getPost({ postId }),
   });
};

type UsePostOptions = {
   postId: string;
   queryConfig?: QueryConfig<typeof getPostQueryOptions>;
};

export const useGetPost = ({ postId, queryConfig }: UsePostOptions) => {
   return useQuery({
      ...getPostQueryOptions(postId),
      ...queryConfig,
   });
};
