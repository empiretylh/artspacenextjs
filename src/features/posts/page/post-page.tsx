import { useParams } from "react-router";
import { useGetPost } from "../api/get-post";
import PostCard from "../component/post-card";

const PostPage = () => {
   const { postId } = useParams();
   const { data, isLoading } = useGetPost({ postId: String(postId) });

   if (isLoading) {
      return <div>Loading...</div>;
   }

   if (!data) {
      return <div>Post not found</div>;
   }

   const post = data.data;

   return (
      <div>
         <PostCard post={post} />
      </div>
   );
};

export default PostPage;
