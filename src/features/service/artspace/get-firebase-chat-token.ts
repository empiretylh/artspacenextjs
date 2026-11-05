import { api } from "@/lib/api-client";

export interface FirebaseChatTokenResponse {
   firebase_token: string;
   uid: string;
   expires_in: number;
}

export const getFirebaseChatToken = async (): Promise<FirebaseChatTokenResponse> => {
   const res = await api.get<FirebaseChatTokenResponse>("/users/chat/firebase-token/");
   return res.data;
};
