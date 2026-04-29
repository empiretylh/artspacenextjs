'use client';

import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/features/service/firebase/firebase';
import { useFcm } from '../hooks/use-fcm';
import { toast } from 'sonner';
import { useChatStore } from '../store';
import { MessageSquare } from 'lucide-react';

export const FcmManager = () => {
   const { registerToken } = useFcm();
   const { openConversation, activeConversationId } = useChatStore();

   useEffect(() => {
      if (!messaging) return;

      const unsubscribe = onMessage(messaging, (payload) => {
         console.log('Foreground message received:', payload);
         
         const convId = payload.data?.conversationId;
         const senderName = payload.data?.senderName || 'New Message';

         // Don't show toast if we are already in this conversation
         if (convId === activeConversationId) return;

         toast(senderName, {
            description: 'Sent you a new message.',
            icon: <MessageSquare className="w-4 h-4 text-primary" />,
            action: {
               label: 'Open',
               onClick: () => {
                  if (convId) openConversation(convId);
               }
            },
         });
      });

      return () => unsubscribe();
   }, [activeConversationId, openConversation]);

   return null; // Headless component
};
