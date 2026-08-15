import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";
import { env } from "@/config/env";

export async function GET() {
   // Check if we are in development mode to prevent running in production
   if (process.env.NODE_ENV !== "development" && env.NODE_ENV !== "development") {
      return NextResponse.json(
         { success: false, error: "Only allowed in development mode" },
         { status: 403 }
      );
   }

   const errors: any[] = [];
   const syncedUsers: any[] = [];
   let updatedUsersCount = 0;
   let updatedConversationsCount = 0;

   try {
      const userTypes = ["artist", "collector", "gallery"];
      const allUsers: any[] = [];

      // 1. Fetch user lists from the staging API
      for (const type of userTypes) {
         try {
            const url = `${env.API_URL}/api/v1/users/${type}/?limit=250`;
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) {
               throw new Error(`Failed to fetch ${type} users: ${res.statusText}`);
            }
            const data = await res.json();
            if (data && Array.isArray(data.results)) {
               allUsers.push(...data.results);
            }
         } catch (err: any) {
            errors.push({ type, error: err.message });
         }
      }

      if (allUsers.length === 0) {
         return NextResponse.json(
            {
               success: false,
               message: "No users fetched from staging API",
               errors,
            },
            { status: 400 }
         );
      }

      // 2. Scan Firestore for users without user_type (buyers)
      const firestoreUsersSnap = await adminDb.collection("users").get();
      const buyerIds: string[] = [];
      if (!firestoreUsersSnap.empty) {
         for (const doc of firestoreUsersSnap.docs) {
            const data = doc.data();
            if (!data.user_type) {
               buyerIds.push(doc.id);
            }
         }
      }

      // Fetch each buyer profile from public profile API and append to allUsers
      let updatedBuyersCount = 0;
      for (const buyerId of buyerIds) {
         try {
            const url = `${env.API_URL}/api/v1/users/profile/public/${buyerId}/`;
            const res = await fetch(url, { cache: "no-store" });
            if (res.ok) {
               const data = await res.json();
               if (data) {
                  allUsers.push(data);
                  updatedBuyersCount++;
               }
            } else {
               errors.push({ type: "buyer_detail", id: buyerId, error: `Failed to fetch: ${res.statusText}` });
            }
         } catch (err: any) {
            errors.push({ type: "buyer_detail", id: buyerId, error: err.message });
         }
      }

      if (allUsers.length === 0) {
         return NextResponse.json(
            {
               success: false,
               message: "No users fetched from staging API",
               errors,
            },
            { status: 400 }
         );
      }

      // 3. Prepare user documents and write them in chunks of 500 to Firestore
      const userChunks: any[][] = [];
      for (let i = 0; i < allUsers.length; i += 500) {
         userChunks.push(allUsers.slice(i, i + 500));
      }

      for (const chunk of userChunks) {
         const batch = adminDb.batch();
         for (const user of chunk) {
            const userIdStr = String(user.id);
            const userRef = adminDb.collection("users").doc(userIdStr);

            const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email || `User ${user.id}`;
            const avatar = user.profile?.profile_picture || null;
            const user_type = user.user_type || (user.num_artworks !== undefined ? "ARTIST" : "COLLECTOR");
            const cover_photo = user.profile?.cover_photo || null;

            const userData = {
               id: userIdStr,
               name,
               avatar,
               user_type,
               cover_photo,
               lastSeen: admin.firestore.FieldValue.serverTimestamp(),
               updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };

            batch.set(userRef, userData, { merge: true });
            syncedUsers.push({ id: userIdStr, name, user_type });
            updatedUsersCount++;
         }
         await batch.commit();
      }

      // 4. Update the conversation metadata (participantDetails) in Firestore /conversations collection
      const conversationsSnap = await adminDb.collection("conversations").get();

      if (!conversationsSnap.empty) {
         // Create chunked batches for conversations (limit: 500 writes per batch)
         let batch = adminDb.batch();
         let batchCount = 0;

         for (const convDoc of conversationsSnap.docs) {
            const convData = convDoc.data();
            const participants = convData.participants || [];
            let needsUpdate = false;
            const updatedDetails: Record<string, any> = {};

            for (const userIdStr of participants) {
               const matchedUser = allUsers.find((u) => String(u.id) === userIdStr);

               if (matchedUser) {
                  const name = matchedUser.name || `${matchedUser.first_name || ""} ${matchedUser.last_name || ""}`.trim() || matchedUser.email || `User ${matchedUser.id}`;
                  const avatar = matchedUser.avatar || matchedUser.profile?.profile_picture || null;
                  const user_type = matchedUser.user_type || (matchedUser.num_artworks !== undefined ? "ARTIST" : "COLLECTOR");
                  const cover_photo = matchedUser.cover_photo || matchedUser.profile?.cover_photo || null;

                  updatedDetails[`participantDetails.${userIdStr}`] = {
                     id: userIdStr,
                     name,
                     avatar,
                     user_type,
                     cover_photo,
                  };
                  needsUpdate = true;
               }
            }

            if (needsUpdate) {
               batch.update(convDoc.ref, {
                  ...updatedDetails,
                  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
               });
               batchCount++;
               updatedConversationsCount++;

               // Commit batch if it reaches the 400 limit
               if (batchCount >= 400) {
                  await batch.commit();
                  batch = adminDb.batch();
                  batchCount = 0;
               }
            }
         }

         if (batchCount > 0) {
            await batch.commit();
         }
      }

      return NextResponse.json({
         success: true,
         message: `Successfully synchronized ${updatedUsersCount} user profiles (including ${updatedBuyersCount} buyers), and updated metadata in ${updatedConversationsCount} conversations.`,
         errors,
         syncedUsersCount: updatedUsersCount,
         syncedBuyersCount: updatedBuyersCount,
         syncedUsers,
      });
   } catch (error: any) {
      console.error("Error in sync-all-profiles API:", error);
      return NextResponse.json(
         {
            success: false,
            error: error.message,
         },
         { status: 500 }
      );
   }
}
