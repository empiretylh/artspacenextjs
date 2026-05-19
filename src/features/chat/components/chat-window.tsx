// components/chat/chat-window.tsx
"use client";

import { useMessages } from "../hooks/use-messages";
import { useSendMessage } from "../hooks/use-send-message";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { useConversations } from "../hooks/use-conversations";
import { useAuth } from "@/features/auth/store";
import { useChatStore } from "../store";
import { Loader2, User as UserIcon, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserQueryOptions } from "@/features/service/artspace/get-user";
import { UserRouteType } from "@/features/service/artspace/get-users";
import { useMarkRead } from "../hooks/use-mark-read";
import { useChatSecurity } from "../hooks/use-chat-security";
import type { ChatUser } from "../types";
import { useEffect, useState } from "react";
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getImage, getUserRouteType } from "@/lib/utils";
import Link from "next/link";
import { paths } from "@/config/paths";

type Props = {
   conversationId?: string | null;
   recipientId?: string | null;
   userType?: UserRouteType | null;
   onBack: () => void;
   variant?: "default" | "mini";
};

export const ChatWindow = ({ 
   conversationId: propConversationId, 
   recipientId: propRecipientId, 
   userType = "artists", 
   onBack,
   variant = "default" 
}: Props) => {
   const { activeConversationId: storeConvId, pendingRecipientId: storeRecipId } = useChatStore();
   
   const conversationId = propConversationId !== undefined ? propConversationId : storeConvId;
   const recipientId = propRecipientId !== undefined ? propRecipientId : storeRecipId;
   
   const { user: currentUser } = useAuth();
   const { conversations } = useConversations();
   const { markAsRead } = useMarkRead();
   const [isProfileOpen, setIsProfileOpen] = useState(false);
   
   const { messages, loading: messagesLoading, hasMore, loadMore } = useMessages(conversationId);
   const { sendMessage } = useSendMessage(conversationId);

   const activeConversation = conversations.find((c) => c.id === conversationId);
   const otherUserId = activeConversation?.participants.find(
      (id) => id !== String(currentUser?.id)
   );
   const finalRecipientId = recipientId || otherUserId || null;

   // Fetch full recipient data for profile sheet
   const { data: recipientData, isLoading: recipientLoading } = useQuery({
      ...getUserQueryOptions(finalRecipientId || "", userType || "artists"),
      enabled: !!finalRecipientId,
   });

   const displayUser: ChatUser | null = activeConversation && otherUserId 
      ? activeConversation.participantDetails[otherUserId] 
      : null;

   const recipientUser: ChatUser | null = recipientData ? {
      id: String((recipientData as any).id),
      name: `${(recipientData as any).first_name || ""} ${(recipientData as any).last_name || ""}`.trim() || (recipientData as any).email,
      avatar: (recipientData as any).profile?.profile_picture || null
   } : null;

   const finalUser = displayUser || recipientUser;

   const { isBlocked } = useChatSecurity(
      conversationId,
      finalRecipientId, 
      userType || "artists"
   );

   const currentUnreadCount = activeConversation?.unreadCount?.[String(currentUser?.id)] || 0;

   // Mark as read when conversation becomes active or messages arrive
   useEffect(() => {
      if (conversationId && currentUnreadCount > 0) {
         markAsRead(conversationId);
      }
   }, [conversationId, currentUnreadCount, markAsRead]);

   if (!conversationId && !recipientId) {
      return (
         <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Select a conversation
         </div>
      );
   }

   const userProfile = recipientData as any;
   const resolvedUserType = userProfile ? getUserRouteType(userProfile.user_type) : (userType || "artists");
   const profileUrl = finalUser ? `/${resolvedUserType}/${finalUser.id}` : "#";

   return (
      <div className="flex h-full flex-col">
         {finalUser && (
            <ChatHeader 
               conversationId={conversationId} 
               user={finalUser} 
               onBack={onBack}
               onClick={() => setIsProfileOpen(true)}
               variant={variant}
            />
         )}
         
         <div className="flex-1 min-h-0 flex flex-col">
            {messagesLoading && messages.length === 0 ? (
               <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/40" />
               </div>
            ) : (
               <ChatMessages 
                  conversationId={conversationId}
                  messages={messages} 
                  hasMore={hasMore} 
                  onLoadMore={loadMore} 
                  loading={messagesLoading}
               />
            )}
         </div>

         {isBlocked ? (
            <div className="p-4 bg-muted/30 border-t text-center text-sm text-muted-foreground italic">
               You cannot message this user.
            </div>
         ) : (
            <ChatInput 
               conversationId={conversationId}
               onSend={async (text, type, mediaUrls) => {
                  await sendMessage(text, recipientUser || undefined, type, mediaUrls as any);
               }} 
            />
         )}

         {/* Profile Preview Sheet */}
         <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <SheetContent side="right" className="w-full sm:max-w-md p-0 gap-0">
               <SheetHeader className="sr-only">
                  <SheetTitle>{finalUser?.name || "User Profile"} Preview</SheetTitle>
                  <SheetDescription>
                     View basic information and featured works of {finalUser?.name || "this user"}.
                  </SheetDescription>
               </SheetHeader>
               <ScrollArea className="h-full">
                  <div className="flex flex-col pb-8">
                     {/* Cover Section */}
                     <div className="h-32 bg-muted relative">
                        {userProfile?.profile?.cover_photo && (
                           <img 
                              src={getImage(userProfile.profile.cover_photo)} 
                              alt="Cover" 
                              className="w-full h-full object-cover"
                           />
                        )}
                        <div className="absolute -bottom-12 left-6">
                           <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                              <AvatarImage src={getImage(finalUser?.avatar)} alt={finalUser?.name} />
                              <AvatarFallback><UserIcon className="h-10 w-10 text-muted-foreground/40" /></AvatarFallback>
                           </Avatar>
                        </div>
                     </div>

                     <div className="mt-14 px-6 space-y-6">
                        {/* Name & Title */}
                        <div>
                           <div className="flex items-center gap-2">
                              <h3 className="text-2xl font-bold">{finalUser?.name}</h3>
                              {userProfile?.user_type && (
                                 <Badge variant="secondary" className="capitalize">
                                    {userProfile.user_type.toLowerCase()}
                                 </Badge>
                              )}
                           </div>
                           <p className="text-muted-foreground text-sm">
                              {userProfile?.email}
                           </p>
                        </div>

                        {/* Bio/About */}
                        {userProfile?.profile?.about && (
                           <div className="space-y-2">
                              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">About</h4>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                                 {userProfile.profile.about}
                              </p>
                           </div>
                        )}

                        {/* Gallery Preview */}
                        {userProfile?.profile?.features_photos && userProfile.profile.features_photos.length > 0 && (
                           <div className="space-y-3">
                              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">Featured Works</h4>
                              <div className="grid grid-cols-2 gap-2">
                                 {userProfile.profile.features_photos.slice(0, 4).map((p: any) => (
                                    <div key={p.id} className="aspect-square rounded-md overflow-hidden bg-muted group relative">
                                       <img 
                                          src={getImage(p.image)} 
                                          alt="Featured" 
                                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                       />
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Full Profile Action */}
                        {userProfile?.user_type !== "BUYER" && (
                           <div className="pt-4">
                              <Button asChild className="w-full gap-2" variant="default">
                                 <Link href={profileUrl}>
                                    View Full Profile
                                    <ExternalLink className="h-4 w-4" />
                                 </Link>
                              </Button>
                           </div>
                        )}
                     </div>
                  </div>
               </ScrollArea>
            </SheetContent>
         </Sheet>
      </div>
   );
};
