import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { useGetPosts } from "../api/get-posts";
import { PostList } from "../component/post-list";

export const PostsPage = () => {
   const { data, isLoading } = useGetPosts();

   if (isLoading) {
      return <div>Loading...</div>;
   }

   const posts = data?.data || [];

   return (
      <div className="container mx-auto p-4">
         <h1>Posts (masonry layout)</h1>
         <div className="mt-4">
            <div className="mb-4 flex justify-end">
               <Link to={paths.posts.create.path}>
                  <Button>Create Post</Button>
               </Link>
            </div>
            <PostList posts={posts} />
         </div>
      </div>
   );
};
