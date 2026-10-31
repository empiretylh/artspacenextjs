// components/chat/chat-layout.tsx
"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatList } from "./chat-list";
import { ChatWindow } from "./chat-window";
import { useConversations } from "../hooks/use-conversations";
import { useAuth } from "@/features/auth/store";
import { useChatStore } from "../store";
import { UserRouteType } from "@/features/service/artspace/get-users";
import { generateOrderInquiryMessage } from "@/config/support";
import { getRelativeImagePath } from "@/lib/utils";

export const ChatLayout = () => {
   const searchParams = useSearchParams();
   const router = useRouter();
   const { user: currentUser } = useAuth();
   const { conversations, loading: conversationsLoading } = useConversations();
   
   const { 
      activeConversationId, 
      pendingRecipientId, 
      setActiveConversationId, 
      setPendingRecipientId 
   } = useChatStore();

   const userIdParam = searchParams.get("userId");
   const userTypeParam = searchParams.get("userType") as UserRouteType | null;
   const initialMessageParam = searchParams.get("initialMessage");
   const orderIdParam = searchParams.get("orderId");
   const orderCodeParam = searchParams.get("orderCode");
   const artworkIdParam = searchParams.get("artworkId");
   const artworkTitleParam = searchParams.get("artworkTitle");
   const artworkImageParam = searchParams.get("artworkImage");
   const priceParam = searchParams.get("price");
   const currencyParam = searchParams.get("currency");
   const statusParam = searchParams.get("status");

   const orderCardData = (orderIdParam && orderCodeParam && artworkTitleParam) ? {
      orderId: orderIdParam,
      orderCode: orderCodeParam,
      artworkId: artworkIdParam || undefined,
      artworkTitle: artworkTitleParam,
      artworkImage: getRelativeImagePath(artworkImageParam) || undefined,
      price: priceParam || "",
      currency: currencyParam || "MMK",
      status: statusParam || undefined,
   } : null;

   const effectiveInitialMessage = initialMessageParam || (orderCardData ? generateOrderInquiryMessage(orderCardData) : null);

   const handledDeepLinkRef = useRef<string | null>(null);

   // Handle Deep Linking
   useEffect(() => {
      if (!userIdParam || conversationsLoading || !currentUser) return;
      if (handledDeepLinkRef.current === userIdParam) return;

      const existingConv = conversations.find(c => 
         c.participants.includes(userIdParam) && c.participants.includes(String(currentUser.id))
      );

      if (existingConv) {
         setActiveConversationId(existingConv.id);
      } else {
         setPendingRecipientId(userIdParam);
      }
      handledDeepLinkRef.current = userIdParam;
   }, [userIdParam, conversations, conversationsLoading, currentUser, setActiveConversationId, setPendingRecipientId]);

   // Only bind deep-linked initial context if the active conversation is the target of the deep link
   const activeConversation = conversations.find((c) => c.id === activeConversationId);
   const activeOtherUserId = activeConversation?.participants.find(
      (id) => id !== String(currentUser?.id)
   ) || (activeConversationId?.startsWith("one-on-one-") 
      ? activeConversationId.replace("one-on-one-", "").split("-").find(id => id !== String(currentUser?.id))
      : null);

   const chatTargetKey = pendingRecipientId || activeOtherUserId || activeConversationId || "empty";

   const isDeepLinkConversation = Boolean(
      userIdParam && (
         pendingRecipientId === userIdParam ||
         (activeConversation && activeConversation.participants.includes(userIdParam)) ||
         (activeConversationId && activeConversationId.includes(userIdParam))
      )
   );

   const initialMessageForChat = isDeepLinkConversation ? effectiveInitialMessage : null;
   const orderCardForChat = isDeepLinkConversation ? orderCardData : null;
   const userTypeForChat = isDeepLinkConversation ? userTypeParam : null;

   return (
      <div className="relative flex h-[calc(100vh-12rem)] w-full overflow-hidden rounded-xl border border-border bg-background shadow-sm">
         {/* Chat List */}
         <div
            className={`
               h-full
               border-r
               bg-background
               md:w-1/3
               ${(activeConversationId || pendingRecipientId) ? "hidden md:block" : "block w-full"}
            `}
         >
            <ChatList
               activeId={activeConversationId}
               onSelect={(id) => {
                  setActiveConversationId(id);
                  if (searchParams.toString()) router.replace("/chats");
               }}
            />
         </div>

         {/* Chat Window */}
         <div
            className={`
               flex flex-1 flex-col
               ${(!activeConversationId && !pendingRecipientId) ? "hidden md:flex" : "flex w-full"}
            `}
         >
            <ChatWindow
               key={chatTargetKey}
               conversationId={activeConversationId}
               recipientId={pendingRecipientId}
               userType={userTypeForChat}
               initialMessage={initialMessageForChat}
               orderCard={orderCardForChat}
               onClearOrderContext={() => {
                  if (searchParams.toString()) router.replace("/chats");
               }}
               onBack={() => {
                  setActiveConversationId(null);
                  if (searchParams.toString()) router.replace("/chats");
               }}
            />
         </div>
      </div>
   );
};
