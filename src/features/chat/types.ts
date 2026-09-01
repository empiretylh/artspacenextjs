import { Timestamp } from "firebase/firestore";

export interface ChatUser {
   id: string;
   name: string;
   avatar?: string | null;
   user_type?: string | null;
   cover_photo?: string | null;
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

export interface LinkPreviewData {
   url: string;
   title?: string | null;
   description?: string | null;
   image?: string | null;
   siteName?: string | null;
   favicon?: string | null;
}

interface BaseMessage {
   id: string;
   senderId: string;
   createdAt: Timestamp;
   reactions?: Record<string, string>;
   mediaReactions?: Record<string, Record<string, string>>;
   linkPreview?: LinkPreviewData | null;
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
