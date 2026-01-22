import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { useComingSoonStore } from "../coming-soon-store";
import { Button } from "@/components/ui/button";

const ComingSoonModal = () => {
   const { open, title, description, closeModal } = useComingSoonStore();

   return (
      <Dialog open={open} onOpenChange={closeModal}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
               <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <div className="flex justify-end">
               <Button onClick={closeModal}>Close</Button>
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default ComingSoonModal;
