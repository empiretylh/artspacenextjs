'use client'
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/store";
import { paths } from "@/config/paths";
import { useFollowUser } from "@/features/service/artspace/follow-user";
import debounce from "lodash/debounce";
import { getUserRouteType } from "@/lib/utils";
import { profileAnalytics, UserType } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";

export function useFollow({
   userId,
   userType,
   following,
}: {
   userId: string;
   userType: string;
   following: boolean;
}) {
   const router = useRouter();
   const { source } = useSource();
   const { user } = useAuth();
   const followUserMutation = useFollowUser({
      mutationConfig: {
         onSuccess: () => {
            if (isFollowing) {
               profileAnalytics.follow(String(userId), userType.toLocaleLowerCase() as UserType, source);
            } else {
               profileAnalytics.unfollow(String(userId), userType.toLocaleLowerCase() as UserType, source);
            }
         },
      }
   });

   const { mutate } = followUserMutation;

   const [isFollowing, setIsFollowing] = useState(following);

   // Keep refs to avoid stale closures
   const userRef = useRef(user);
   const routerRef = useRef(router);
   const mutateRef = useRef(mutate);

   useEffect(() => {
      userRef.current = user;
      routerRef.current = router;
      mutateRef.current = mutate;
   }, [user, router, mutate]);

   // Create debounce once
   const debouncedFollowRef = useRef<ReturnType<typeof debounce> | null>(null);

   debouncedFollowRef.current ??= debounce((newValue) => {
      if (!userRef.current) {
         routerRef.current.push(paths.auth.login.path);
         return;
      }

      mutateRef.current(
         { userId, userType: getUserRouteType(userType), following: newValue },
         {
            onError: () => {
               setIsFollowing((prev) => !prev);
            },
         }
      );
   }, 1000);

   // Cleanup debounce on unmount
   useEffect(() => {
      return () => {
         debouncedFollowRef.current?.cancel();
      };
   }, []);

   // Sync external following changes
   useEffect(() => {
      setIsFollowing(following);
   }, [following]);

   // Function to call on click
   const handleFollow = () => {
      if (!userRef.current) {
         routerRef.current.push(paths.auth.login.path);
         return;
      }
      const newValue = !isFollowing;
      setIsFollowing(newValue); // optimistic UI
      debouncedFollowRef.current?.(newValue);
   };

   return {
      isFollowing,
      handleFollow,
      isMutating: followUserMutation.isPending,
   };
}
