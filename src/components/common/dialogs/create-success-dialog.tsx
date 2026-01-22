import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { IoMdCheckmark } from "react-icons/io";
import { BaseDialog } from "./base-dialog";

interface CreateSuccessDialogProps {
   createSuccessModalOpen: boolean;
   setCreateSuccessModalOpen: (_isOpen: boolean) => void;
   src: string;
   redirectRoute: string;
}

const CreateSuccessDialog = ({
   createSuccessModalOpen,
   setCreateSuccessModalOpen,
   src,
   redirectRoute,
}: CreateSuccessDialogProps) => {
   return (
      <BaseDialog
         title={`${src} Created Successfully`}
         description={`Your ${src.toLowerCase()} has been successfully created.`}
         isOpen={createSuccessModalOpen}
         onClose={() => setCreateSuccessModalOpen(false)}
      >
         <div className="p-6">
            <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ type: "spring", stiffness: 200, damping: 20 }}
               className="flex flex-col items-center space-y-6 text-center"
            >
               {/* Animated checkmark circle */}
               <div className="relative">
                  <motion.div
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ delay: 0.2 }}
                     className="w-24 h-24 bg-primary rounded-full flex items-center justify-center"
                  >
                     <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-16 h-16 bg-primary rounded-full flex items-center justify-center"
                     >
                        <IoMdCheckmark className="text-secondary text-3xl" />
                     </motion.div>
                  </motion.div>

                  {/* Pulsing ring effect */}
                  <motion.div
                     initial={{ scale: 0.5, opacity: 0 }}
                     animate={{ scale: 1.2, opacity: 0 }}
                     transition={{
                        delay: 0.6,
                        repeat: Infinity,
                        repeatDelay: 1,
                        duration: 1.5,
                     }}
                     className="absolute inset-0 border-4 border-success rounded-full"
                  />
               </div>

               <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">
                     Success!
                  </h2>
                  <p className="text-gray-600">
                     Your {src.toLowerCase()} has been created successfully.
                  </p>
               </div>

               <div className="flex gap-3 w-full pt-2">
                  <Button
                     variant="outline"
                     className="flex-1"
                     onClick={() => setCreateSuccessModalOpen(false)}
                  >
                     Close
                  </Button>
                  <Button className="flex-1">
                     <Link to={redirectRoute}>View {src}</Link>
                  </Button>
               </div>
            </motion.div>
         </div>
      </BaseDialog>
   );
};

export default CreateSuccessDialog;
