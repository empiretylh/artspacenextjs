'use client'
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useFollow } from "@/hooks/app/use-follow";


const FollowButton = ({
   userId,
   userType,
   following,
   size = "sm",
   className,
   loading,
}: {
   userId: string;
   userType: string;
   following: boolean;
   loading?: boolean;
   size?: "sm" | "default" | "lg" | "icon" | null | undefined;
   className?: string;
}) => {
   const { isFollowing, handleFollow, isMutating } = useFollow({
      userId,
      userType,
      following,
   });

   if (loading) {
      return (
         <Button variant="outline" size={size} disabled>
            Loading ...
         </Button >
      )
   }

   return (
      <Button
         variant={isFollowing ? "outline" : "default"}
         onClick={handleFollow}
         size={size}
         disabled={isMutating}
         className={cn("", size === "sm" && "w-[70px]", className)}
      >
         <span className={cn("truncate", size === "sm" && "text-xs")}>
            {isFollowing ? "Unfollow" : "Follow"}
         </span>
      </Button>
   );
};

export default FollowButton;
