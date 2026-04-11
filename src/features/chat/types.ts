import { Timestamp } from "firebase/firestore";

export interface ChatUser {
   id: string;
   name: string;
   avatar?: string | null;
}

export interface UserDocument extends ChatUser {
   lastSeen?: Timestamp;
   updatedAt: Timestamp;
}

export interface Conversation {
   id: string;
   participants: string[]; // Array of user IDs
   participantDetails: Record<string, ChatUser>; // Fast lookup for names/avatars
   lastMessage: string | null;
   updatedAt: Timestamp | null;
   unreadCount?: Record<string, number>;
}

export interface Message {
   id: string;
   senderId: string;
   content: string;
   createdAt: Timestamp;
}
