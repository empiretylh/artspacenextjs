import { useParams } from "next/navigation";
import { useGetPost } from "../api/get-post";
import PostCard from "../component/post-card";

const PostPage = () => {
   const params = useParams() as { postId?: string };
   const postId = params?.postId ?? "";
   const { data, isLoading } = useGetPost({ postId });

   if (isLoading) {
      return <div>Loading...</div>;
   }

   if (!data) {
      return <div>Post not found</div>;
   }

   const post = data;

   return (
      <div>
         <PostCard post={post} />
      </div>
   );
};

export default PostPage;
