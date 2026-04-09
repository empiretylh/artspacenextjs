import { Timestamp } from "firebase/firestore";

export interface ChatUser {
   id: string;
   name: string;
   avatar?: string | null;
}

export interface Conversation {
   id: string;
   participants: string[]; // Array of user IDs
   participantDetails: Record<string, ChatUser>; // Fast lookup for names/avatars
   lastMessage: string | null;
   updatedAt: Timestamp | null;
   unreadCount?: Record<string, number>;
}

export interface ChatMessage {
   id: string;
   senderId: string;
   content: string;
   createdAt: Timestamp;
}
