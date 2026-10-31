import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/store";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";
import debounce from "lodash/debounce";
import { useLikeArtwork } from "@/features/service/artspace/like-artwork";
import { artworkAnalytics } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";

interface UseLikeOptions {
   artworkId: string; // postId, commentId, etc.
   initialLiked: boolean;
   initialCount?: number;
   debounceMs?: number; // optional debounce duration
}

export function useLike({
   artworkId,
   initialLiked,
   initialCount = 0,
   debounceMs = 300,
}: UseLikeOptions) {
   const router = useRouter();
   const user = useAuth((state) => state.user);
   const { source } = useSource();
   const likeMutation = useLikeArtwork({
      mutationConfig: {
         onSuccess: () => {
            if (isLiked) {
               artworkAnalytics.like(String(artworkId), source);
            } else {
               artworkAnalytics.unlike(String(artworkId), source);
            }
         },
      }
   }); // custom mutation hook

   const { mutate } = likeMutation;

   const [isLiked, setIsLiked] = useState(initialLiked);
   const [count, setCount] = useState(initialCount);

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
         { artworkId, like: isLikedRef.current }, // true or false
         {
            onError: () => {
               // rollback optimistic UI
               const reverted = !isLikedRef.current;
               isLikedRef.current = reverted;
               setIsLiked(reverted);
               setCount((prev) => Math.max(0, prev + (reverted ? 1 : -1)));
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

   //  like with optimistic UI
   const handleLike = () => {
      if (!userRef.current) {
         routerRef.current.push(paths.auth.login.path);
         return;
      }
      const nextLiked = !isLikedRef.current;
      isLikedRef.current = nextLiked;
      setIsLiked(nextLiked);
      setCount((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));
      debouncedLikeRef.current?.();
   };

   // Sync external changes
   useEffect(() => {
      setIsLiked(initialLiked);
   }, [initialLiked]);

   useEffect(() => {
      setCount(initialCount);
   }, [initialCount]);

   return {
      isLiked,
      count,
      handleLike,
      isMutating: likeMutation.isPending,
   };
}
