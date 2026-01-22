import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/store";
import { paths } from "@/config/paths";
import debounce from "lodash/debounce";
import { useInterestEvent as useInterestEventService } from "@/features/service/artspace/interest-event";

export function useInterestEvent({
   eventId,
   interested,
}: {
   eventId: string;
   interested: boolean;
}) {
   const router = useRouter();
   const { user } = useAuth();
   const interestEventMutation = useInterestEventService();

   const { mutate } = interestEventMutation;

   const [isInterested, setIsInterested] = useState(interested);

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
   const debouncedInterestEventRef = useRef<ReturnType<typeof debounce> | null>(
      null
   );

   debouncedInterestEventRef.current ??= debounce((newValue) => {
      if (!userRef.current) {
         navigateRef.current(paths.auth.login.path);
         return;
      }

      mutateRef.current(
         { eventId: eventId, interested: newValue },
         {
            onError: () => {
               setIsInterested((prev) => !prev);
            },
         }
      );
   }, 1000);

   // Cleanup debounce on unmount
   useEffect(() => {
      return () => {
         debouncedInterestEventRef.current?.cancel();
      };
   }, []);

   // Sync external interested changes
   useEffect(() => {
      setIsInterested(interested);
   }, [interested]);

   // Function to call on click
   const handleInterestEvent = () => {
      if (!userRef.current) {
         navigateRef.current(paths.auth.login.path);
         return;
      }
      const newValue = !isInterested;
      setIsInterested(newValue); // optimistic UI
      debouncedInterestEventRef.current?.(newValue);
   };

   return {
      isInterested,
      handleInterestEvent,
      isMutating: interestEventMutation.isPending,
   };
}
