import { BaseDialog } from "@/components/common/dialogs/base-dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, Trash } from "lucide-react";

type EventInviteEmailConfirmDialogProps = {
   isEventInviteEmailModalOpen: boolean;
   setIsEventInviteEmailModalOpen: (isOpen: boolean) => void;
   handleEventInviteEmail: () => void;
   isLoading?: boolean;
   title?: string;
   description?: string;
};

const EventInviteEmailConfirmDialog = ({
   isEventInviteEmailModalOpen,
   setIsEventInviteEmailModalOpen,
   handleEventInviteEmail,
   isLoading = false,
   title = "item",
   description = "Are you sure you would like to eventInviteEmail this?",
}: EventInviteEmailConfirmDialogProps) => {
   return (
      <BaseDialog
         title={`EventInviteEmail ${title}`}
         description={description}
         isOpen={isEventInviteEmailModalOpen}
         onClose={() => setIsEventInviteEmailModalOpen(false)}
      >
         <div className="p-4 sm:p-6 max-w-sm mx-auto">
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
                             rounded-full bg-primary/10"
               >
                  <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
               </motion.div>

               {/* Text */}
               <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-2"
               >
                  <h2 className="text-lg font-semibold">
                     Send Email Invitation for this {title}
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
                     onClick={() => setIsEventInviteEmailModalOpen(false)}
                  >
                     Cancel
                  </Button>

                  <Button
                     type="button"
                     className="flex-1"
                     onClick={handleEventInviteEmail}
                     loading={isLoading}
                  >
                     Send
                  </Button>
               </motion.div>
            </motion.div>
         </div>
      </BaseDialog>
   );
};

export default EventInviteEmailConfirmDialog;
