import { useEffect, useCallback } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { messaging, db } from '@/features/service/firebase/firebase';
import { useAuth } from '@/features/auth/store';
import { env } from '@/config/env';

export const useFcm = () => {
   const { user } = useAuth();

   const registerToken = useCallback(async () => {
      if (!messaging || !db || !user?.id) return;

      try {
         const permission = await Notification.requestPermission();
         if (permission === 'granted') {
            const token = await getToken(messaging, {
               vapidKey: env.FIREBASE_VAPID_KEY
            });

            if (token) {
               const userRef = doc(db, 'users', String(user.id));
               await updateDoc(userRef, {
                  fcmTokens: arrayUnion(token)
               });
               console.log('FCM Token registered');
            }
         }
      } catch (error) {
         console.error('Error registering FCM token:', error);
      }
   }, [user?.id]);

   useEffect(() => {
      if (user?.id) {
         registerToken();
      }
   }, [user?.id, registerToken]);

   useEffect(() => {
      if (!messaging) return;

      const unsubscribe = onMessage(messaging, (payload) => {
         console.log('Foreground message received:', payload);
         // This will be handled by FcmManager component for toasts
      });

      return () => unsubscribe();
   }, []);

   return { registerToken };
};
