import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminMessaging } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
   try {
      const { recipientId, senderName, conversationId } = await req.json();

      if (!recipientId || !senderName) {
         return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      // 1. Get recipient tokens
      const userDoc = await adminDb.collection('users').doc(String(recipientId)).get();
      const userData = userDoc.data();
      const tokens = userData?.fcmTokens as string[] | undefined;

      if (!tokens || tokens.length === 0) {
         return NextResponse.json({ success: true, message: 'No tokens found' });
      }

      // 2. Prepare payload (Data-only for manual control in Service Worker)
      const payload = {
         data: {
            type: 'chat_message',
            title: 'New Message',
            body: `You have a new message from ${senderName}`,
            conversationId: String(conversationId),
            senderName: String(senderName),
         },
      };

      // 3. Send to all tokens
      const responses = await Promise.allSettled(
         tokens.map(token => 
            adminMessaging.send({
               token,
               ...payload
            })
         )
      );

      // 4. Optional: Cleanup invalid tokens
      const invalidTokens: string[] = [];
      responses.forEach((res, index) => {
         if (res.status === 'rejected') {
            const error = res.reason;
            if (error.code === 'messaging/registration-token-not-registered' || 
                error.code === 'messaging/invalid-registration-token') {
               invalidTokens.push(tokens[index]);
            }
         }
      });

      if (invalidTokens.length > 0) {
         await adminDb.collection('users').doc(String(recipientId)).update({
            fcmTokens: tokens.filter(t => !invalidTokens.includes(t))
         });
      }

      return NextResponse.json({ success: true });
   } catch (error: any) {
      console.error('FCM API Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
   }
}
