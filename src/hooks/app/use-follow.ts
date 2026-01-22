'use client'
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/store";
import { paths } from "@/config/paths";
import { useFollowUser } from "@/features/service/artspace/follow-user";
import debounce from "lodash/debounce";

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
   const { user } = useAuth();
   const followUserMutation = useFollowUser();

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

   if (!debouncedFollowRef.current) {
      debouncedFollowRef.current = debounce((newValue) => {
         if (!userRef.current) {
            routerRef.current.push(paths.auth.login.path);
            return;
         }

         mutateRef.current(
            { userId, userType, following: newValue },
            {
               onError: () => {
                  setIsFollowing((prev) => !prev);
               },
            }
         );
      }, 1000);
   }

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
