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
   showCloseButton?: boolean;
}

export function BaseDialog({
   title,
   description,
   isOpen,
   onClose,
   children,
   className,
   headerOff = true,
   showCloseButton = true
}: Readonly<BaseDialogProps>) {
   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent
            onCloseAutoFocus={(e) => {
               e.preventDefault(); // stop Radix default behavior
            }}
            title={title}
            className={cn(
               "max-w-[calc(100%-2rem)] xs:max-w-sm sm:max-w-md rounded-lg p-0 overflow-hidden",
               className
            )}
            showCloseButton={showCloseButton}
         >
            {headerOff && (
               <DialogHeader className="sr-ony hidden">
                  <DialogTitle>{title}</DialogTitle>
                  <DialogDescription>{description}</DialogDescription>
               </DialogHeader>
            )}
            {children}
         </DialogContent>
      </Dialog>
   );
}
