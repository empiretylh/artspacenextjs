import { Main } from "@/components/layout/main";
import { paths } from "@/config/paths";
import { useNavigate, useParams } from "react-router";
import PostEditForm from "../component/post-edit-form";

const PostEditPage = () => {
   const { id } = useParams();
   const router = useRouter();

   if (!id) {
      router.push(paths.notFound.path);
      return null;
   }

   return (
      <Main>
         <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
            <div>
               <h2 className="text-2xl font-bold tracking-tight">
                  Post Update Form
               </h2>
               <p className="text-muted-foreground">Update Post</p>
            </div>
         </div>
         <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
            <PostEditForm postId={Number(id)} onUpdateSuccess={() => { }} />
         </div>
      </Main>
   );
};

export default PostEditPage;
