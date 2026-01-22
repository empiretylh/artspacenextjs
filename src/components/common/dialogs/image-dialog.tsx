// components/image-modal.tsx
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { getImage } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface ImageModalProps {
   open: boolean;
   onClose: () => void;
   imageFilename: string | null;
}

const ImageModal = ({ open, onClose, imageFilename }: ImageModalProps) => {
   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent className="w-[500px] h-[500px]">
            <DialogHeader className="hidden">
               <DialogTitle>Image Preview</DialogTitle>
               <DialogDescription>
                  Image Preview for the selected item.
               </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center h-full w-full">
               <AnimatePresence>
                  {imageFilename && (
                     <motion.img
                        src={getImage({ filename: imageFilename })}
                        alt="Large Image"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full object-contain"
                     />
                  )}
               </AnimatePresence>
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default ImageModal;
