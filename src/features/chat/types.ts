import { Timestamp } from "firebase/firestore";

export interface ChatUser {
   id: string;
   name: string;
   avatar?: string | null;
}

export interface UserDocument extends ChatUser {
   lastSeen?: Timestamp;
   updatedAt: Timestamp;
   blockedUserIds?: string[];
}

export interface Conversation {
   id: string;
   participants: string[]; // Array of user IDs
   participantDetails: Record<string, ChatUser>; // Fast lookup for names/avatars
   lastMessage: string | null;
   updatedAt: Timestamp | null;
   unreadCount?: Record<string, number>;
   typing?: Record<string, Timestamp>;
}

export type Message = BaseMessage & (TextMessage | ImageMessage);

interface BaseMessage {
   id: string;
   senderId: string;
   createdAt: Timestamp;
}

interface TextMessage {
   type: 'text';
   content: string;
}

interface ImageMessage {
   type: 'image';
   content: string; // Fallback text/caption
   mediaUrls: string[]; 
   mediaUrl?: string; // Legacy field
}
