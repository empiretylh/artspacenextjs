import type { Post } from "@/types";
import PostCard from "./post-card";

export const PostList = ({ posts }: { posts: Post[] }) => {
   return (
      <div className="columns-4 gap-4">
         {posts.map((post) => (
            <PostCard key={post.id} post={post} />
         ))}
      </div>
   );
};
