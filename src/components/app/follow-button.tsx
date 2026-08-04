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
   size?: "sm" | "default" | "lg" | "icon" | "profile" | null | undefined;
   className?: string;
}) => {
   const { isFollowing, handleFollow, isMutating } = useFollow({
      userId,
      userType,
      following,
   });

   const innerButtonSize = size === "profile" ? "sm" : size === null ? undefined : size;

   if (loading) {
      return (
         <Button variant="outline" size={innerButtonSize} disabled>
            Loading ...
         </Button >
      )
   }

   return (
      <Button
         variant={isFollowing ? "outline" : "default"}
         onClick={handleFollow}
         size={innerButtonSize}
         disabled={isMutating}
         className={cn("", size === "sm" && "w-[70px]", className)}
      >
         <span className={cn(size === "sm" && "truncate text-xs", size === "profile" && "text-xs")}>
            {isFollowing ? "Unfollow" : "Follow"}
         </span>
      </Button>
   );
};

export default FollowButton;
