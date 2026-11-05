import * as admin from 'firebase-admin';
import { env } from '@/config/env';

const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const hasAdminCredentials = Boolean(
   env.FIREBASE_PROJECT_ID &&
   env.FIREBASE_CLIENT_EMAIL &&
   privateKey
);

if (!admin.apps.length && hasAdminCredentials) {
   try {
      admin.initializeApp({
         credential: admin.credential.cert({
            projectId: env.FIREBASE_PROJECT_ID,
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
         }),
      });
   } catch (error) {
      console.warn("Failed to initialize Firebase Admin SDK:", error);
   }
}

export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminMessaging = admin.apps.length ? admin.messaging() : null;
export const adminAuth = admin.apps.length ? admin.auth() : null;
