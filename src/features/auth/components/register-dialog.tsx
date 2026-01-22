import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import RegisterForm from "./register-form";
import { useAuth } from "../store";

export function RegisterDialog() {
   const { isRegisterDialogOpen, setRegisterDialogOpen } = useAuth();
   return (
      <Dialog open={isRegisterDialogOpen} onOpenChange={setRegisterDialogOpen}>
         <DialogContent className="w-full sm:max-w-[425px] h-full sm:h-auto">
            <DialogHeader className="sr-only">
               <DialogTitle>Register</DialogTitle>
               <DialogDescription>Register</DialogDescription>
            </DialogHeader>
            <RegisterForm />
         </DialogContent>
      </Dialog>
   );
}
