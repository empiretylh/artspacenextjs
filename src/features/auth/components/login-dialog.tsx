import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import LoginForm from "./login-form";
import { useAuth } from "../store";

export function LoginDialog() {
   const { isLoginDialogOpen, setLoginDialogOpen } = useAuth();
   return (
      <Dialog open={isLoginDialogOpen} onOpenChange={setLoginDialogOpen}>
         <DialogContent className="w-full sm:max-w-[425px] h-full sm:h-auto">
            <DialogHeader className="sr-only">
               <DialogTitle>Login</DialogTitle>
               <DialogDescription>Login</DialogDescription>
            </DialogHeader>
            <LoginForm />
         </DialogContent>
      </Dialog>
   );
}
