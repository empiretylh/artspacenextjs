import CreateSuccessDialog from "@/components/common/dialogs/create-success-dialog";
import { Main } from "@/components/layout/main";
import { paths } from "@/config/paths";
import { useState } from "react";
import PostCreateForm from "../component/post-create-form";

const PostCreatePage = () => {
   const [isCreateSuccessModalOpen, setIsCreateSuccessModalOpen] =
      useState(false);

   return (
      <>
         <Main>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
               <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                     Post Create Form
                  </h2>
                  <p className="text-muted-foreground">Create Post</p>
               </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
               <PostCreateForm
                  onCreateSuccess={() => setIsCreateSuccessModalOpen(true)}
               />
            </div>
         </Main>
         <CreateSuccessDialog
            src="Post"
            createSuccessModalOpen={isCreateSuccessModalOpen}
            setCreateSuccessModalOpen={setIsCreateSuccessModalOpen}
            redirectRoute={paths.posts.path}
         />
      </>
   );
};

export default PostCreatePage;
