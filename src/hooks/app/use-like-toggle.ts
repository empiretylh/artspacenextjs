import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/store";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";
import debounce from "lodash/debounce";
import { useLikeArtworkToggle } from "@/features/service/artspace/like-artwork-toggle";

interface UseLikeToggleOptions {
   artworkId: string; // postId, commentId, etc.
   initialLiked: boolean;
   initialCount?: number;
   debounceMs?: number; // optional debounce duration
}

export function useLikeToggle({
   artworkId,
   initialLiked,
   debounceMs = 300,
}: UseLikeToggleOptions) {
   const router = useRouter();
   const { user } = useAuth();
   const likeMutation = useLikeArtworkToggle(); // custom mutation hook

   const { mutate } = likeMutation;

   const [isLiked, setIsLiked] = useState(initialLiked);

   // Refs to avoid stale closures inside debounce
   const userRef = useRef(user);
   const routerRef = useRef(router);
   const mutateRef = useRef(mutate);
   const isLikedRef = useRef(isLiked);

   useEffect(() => {
      userRef.current = user;
      routerRef.current = router;
      mutateRef.current = mutate;
      isLikedRef.current = isLiked;
   }, [user, router, mutate, isLiked]);

   // Debounced server call
   const debouncedLikeRef = useRef<ReturnType<typeof debounce> | null>(null);

   debouncedLikeRef.current ??= debounce(() => {
      if (!userRef.current) {
         routerRef.current.push(paths.auth.login.path);
         return;
      }

      mutateRef.current(
         { artworkId }, // true or false
         {
            onError: () => {
               // rollback optimistic UI
               setIsLiked((prev) => !prev);
            },
         }
      );
   }, debounceMs);

   // Cleanup on unmount
   useEffect(() => {
      return () => {
         debouncedLikeRef.current?.cancel();
      };
   }, []);

   // Toggle like with optimistic UI
   const toggleLike = () => {
      setIsLiked((prev) => !prev);
      isLikedRef.current = !isLikedRef.current;
      debouncedLikeRef.current?.();
   };

   // Sync external changes
   useEffect(() => {
      setIsLiked(initialLiked);
   }, [initialLiked]);

   return {
      isLiked,
      toggleLike,
      isMutating: likeMutation.isPending,
   };
}
