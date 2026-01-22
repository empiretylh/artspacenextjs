import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/store";
import { paths } from "@/config/paths";
import { useFollowUserToggle } from "@/features/service/artspace/follow-user-toggle";
import debounce from "lodash/debounce";

export function useFollowToggle({
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
   const followUserToggleMutation = useFollowUserToggle();

   const { mutate } = followUserToggleMutation;

   const [isFollowing, setIsFollowing] = useState(following);

   // Keep refs to avoid stale closures
   const userRef = useRef(user);
   const navigateRef = useRef(navigate);
   const mutateRef = useRef(mutate);

   useEffect(() => {
      userRef.current = user;
      navigateRef.current = navigate;
      mutateRef.current = mutate;
   }, [user, navigate, mutate]);

   // Create debounce once
   const debouncedFollowRef = useRef<ReturnType<typeof debounce> | null>(null);

   if (!debouncedFollowRef.current) {
      debouncedFollowRef.current = debounce(() => {
         if (!userRef.current) {
            navigateRef.current(paths.auth.login.path);
            return;
         }

         mutateRef.current(
            { userId, userType },
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
   const toggleFollow = () => {
      setIsFollowing((prev) => !prev); // optimistic UI
      debouncedFollowRef.current?.();
   };

   return {
      isFollowing,
      toggleFollow,
      isMutating: followUserToggleMutation.isPending,
   };
}
