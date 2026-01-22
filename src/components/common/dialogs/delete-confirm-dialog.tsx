import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { BaseDialog } from "./base-dialog";

type DeleteConfirmDialogProps = {
   isDeleteModalOpen: boolean;
   setIsDeleteModalOpen: (isOpen: boolean) => void;
   handleDelete: () => void;
   isDeleting?: boolean;
   title?: string;
   description?: string;
};

const DeleteConfirmDialog = ({
   isDeleteModalOpen,
   setIsDeleteModalOpen,
   handleDelete,
   isDeleting = false,
   title = "item",
   description = "Are you sure you would like to delete this?",
}: DeleteConfirmDialogProps) => {
   return (
      <BaseDialog
         title={`Delete ${title}`}
         description={description}
         isOpen={isDeleteModalOpen}
         onClose={() => setIsDeleteModalOpen(false)}
      >
         <div className="p-4 sm:p-6 max-w-xs mx-auto">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.2, ease: "easeOut" }}
               className="flex flex-col items-center text-center gap-6"
            >
               {/* Icon */}
               <motion.div
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-center 
                             w-16 h-16 sm:w-20 sm:h-20 
                             rounded-full bg-accent"
               >
                  <Trash className="w-8 h-8 sm:w-10 sm:h-10" />
               </motion.div>

               {/* Text */}
               <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-2"
               >
                  <h2 className="text-lg font-semibold">
                     Delete &quot;{title}&quot;
                  </h2>
                  <p className="text-sm">{description}</p>
               </motion.div>

               {/* Actions */}
               <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col-reverse sm:flex-row gap-3 w-full"
               >
                  <Button
                     type="button"
                     variant="outline"
                     className="flex-1"
                     onClick={() => setIsDeleteModalOpen(false)}
                  >
                     Cancel
                  </Button>

                  <Button
                     type="button"
                     variant="default"
                     className="flex-1"
                     onClick={handleDelete}
                     loading={isDeleting}
                  >
                     Delete
                  </Button>
               </motion.div>
            </motion.div>
         </div>
      </BaseDialog>
   );
};

export default DeleteConfirmDialog;
