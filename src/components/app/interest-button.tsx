import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import NotInterestEventButton from "./not-interest-button";
import { useInterestEvent } from "@/features/service/artspace/interest-event";
import { useAuth } from "@/features/auth/store";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";

const InterestEventButton = ({
   eventId,
   interested,
   size = "sm",
   className,
   loading = false,
}: {
   eventId: string;
   interested: boolean;
   size?: "sm" | "default" | "lg" | "icon" | null | undefined;
   className?: string;
   loading?: boolean;
}) => {
   const interestEventMutation = useInterestEvent();
   const { user } = useAuth();
   const router = useRouter();

   const handleInterestEvent = () => {
      if (!user) {
         router.push(paths.auth.login.path);
         return;
      }
      interestEventMutation.mutate({ eventId, interested: !interested });
   };

   if (loading) {
      return (
         <Button variant="outline" size={size} disabled>
            <span className={cn("truncate", size === "sm" && "text-xs")}>
               Loading ...
            </span>
         </Button>
      );
   }

   return (
      <>
         {interested && (
            <NotInterestEventButton
               size={size}
               eventId={eventId}
               interested={interested}
            />
         )}
         {interested === false && (
            <Button
               variant={"outline"}
               onClick={handleInterestEvent}
               size={size}
               disabled={interestEventMutation.isPending}
               className={cn(className)}
            >
               <span className={cn("truncate", size === "sm" && "text-xs")}>
                  {interested ? "Not interested" : "Interested"}
               </span>
            </Button>
         )}
      </>
   );
};

export default InterestEventButton;
