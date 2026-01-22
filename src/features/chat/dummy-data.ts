// components/chat/dummy-data.ts
export type ChatUser = {
   id: string;
   name: string;
   avatar?: string;
};

export type Message = {
   id: string;
   senderId: string;
   content: string;
   createdAt: string;
};

export const users: ChatUser[] = [
   { id: "1", name: "Aiko Tanaka" },
   { id: "2", name: "Lucas Martin" },
   { id: "3", name: "Sofia Alvarez" },
];

export const conversations = [
   {
      id: "conv-1",
      user: users[0],
      lastMessage: "Loved your latest artwork!",
      unreadCount: 2,
      isOnline: true,
   },
   {
      id: "conv-2",
      user: users[1],
      lastMessage: "Are you open for commissions?",
      unreadCount: 0,
      isOnline: false,
   },
];

export const messages: Message[] = [
   {
      id: "m1",
      senderId: "1",
      content: "Hey! I really like your abstract series.",
      createdAt: "10:30",
   },
   {
      id: "m2",
      senderId: "me",
      content: "Thank you! That means a lot.",
      createdAt: "10:32",
   },
];
