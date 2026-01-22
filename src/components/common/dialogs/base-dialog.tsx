import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface BaseDialogProps {
   title?: string;
   description?: string;
   isOpen: boolean;
   onClose: () => void;
   children?: React.ReactNode;
   className?: string;
   headerOff?: boolean;
}

export function BaseDialog({
   title,
   description,
   isOpen,
   onClose,
   children,
   className,
   headerOff = false,
}: Readonly<BaseDialogProps>) {
   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent
            className={cn(
               "max-w-[calc(100%-2rem)] xs:max-w-sm sm:max-w-md rounded-lg p-0 overflow-hidden",
               className
            )}
         >
            {!headerOff && (
               <DialogHeader className="hidden">
                  <DialogTitle>{title}</DialogTitle>
                  <DialogDescription>{description}</DialogDescription>
               </DialogHeader>
            )}
            {children}
         </DialogContent>
      </Dialog>
   );
}
