// components/chat/chat-header.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
   user: { name: string };
   onBack: () => void;
};

export const ChatHeader = ({ user, onBack }: Props) => {
   return (
      <div className="flex items-center gap-3 border-b p-4">
         <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onBack}
         >
            <ArrowLeft className="h-4 w-4" />
         </Button>

         <Avatar>
            <AvatarFallback>{user.name[0]}</AvatarFallback>
         </Avatar>

         <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">Active now</p>
         </div>
      </div>
   );
};
