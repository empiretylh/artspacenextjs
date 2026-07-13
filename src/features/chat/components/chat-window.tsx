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
import { useTranslations } from "next-intl";

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
   const t = useTranslations("Chat");
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

   const displayUser: ChatUser | null = activeConversation && otherUserId 
      ? activeConversation.participantDetails[otherUserId] 
      : null;

   // Try to resolve user type from cached Firestore participant data first to avoid 404 queries
   const initialUserType = displayUser?.user_type 
      ? getUserRouteType(displayUser.user_type) 
      : (userType || "artists");

   // Fetch full recipient data for profile sheet
   const { data: recipientData, isLoading: recipientLoading } = useQuery({
      ...getUserQueryOptions(finalRecipientId || "", initialUserType),
      enabled: !!finalRecipientId,
   });

   const userProfile = recipientData as any;
   const resolvedUserType = userProfile 
      ? getUserRouteType(userProfile.user_type) 
      : initialUserType;

   const recipientUser: ChatUser | null = recipientData ? {
      id: String((recipientData as any).id),
      name: `${(recipientData as any).first_name || ""} ${(recipientData as any).last_name || ""}`.trim() || (recipientData as any).email,
      avatar: (recipientData as any).profile?.profile_picture || null,
      user_type: (recipientData as any).user_type || null,
      cover_photo: (recipientData as any).profile?.cover_photo || null,
   } : null;

   const finalUser = displayUser ? {
      ...displayUser,
      ...(recipientUser || {})
   } : recipientUser;

   const { isBlocked } = useChatSecurity(
      conversationId,
      finalRecipientId, 
      resolvedUserType
   );

   const participantDetails = activeConversation?.participantDetails || (finalRecipientId && finalUser ? {
      [String(currentUser?.id)]: {
         id: String(currentUser?.id),
         name: `${currentUser?.first_name || ""} ${currentUser?.last_name || ""}`.trim() || currentUser?.email || "You",
         avatar: currentUser?.profile?.profile_picture || null
      },
      [finalRecipientId]: finalUser
   } : undefined);

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
            {t("selectConversation")}
         </div>
      );
   }

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
         
         <div className="flex-grow min-h-0 flex flex-col">
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
                  participantDetails={participantDetails}
               />
            )}
         </div>

         {isBlocked ? (
            <div className="p-4 bg-muted/30 border-t text-center text-sm text-muted-foreground italic">
               {t("blockedWarning")}
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
                  <SheetTitle>{t("profilePreviewTitle", { name: finalUser?.name || "User Profile" })}</SheetTitle>
                  <SheetDescription>
                     {t("profilePreviewDescription", { name: finalUser?.name || "this user" })}
                  </SheetDescription>
               </SheetHeader>
               <ScrollArea className="h-full">
                  <div className="flex flex-col pb-8">
                     {/* Cover Section */}
                     <div className="h-32 bg-muted relative">
                         {(userProfile?.profile?.cover_photo || finalUser?.cover_photo) && (
                            <img 
                               src={getImage(userProfile?.profile?.cover_photo || finalUser?.cover_photo)} 
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
                               <h3 className="text-2xl font-bold font-display tracking-tight text-foreground">{finalUser?.name}</h3>
                               {userProfile?.user_type && (
                                  <Badge variant="secondary" className="capitalize rounded-full border border-border text-xs px-3 py-0.5">
                                     {userProfile.user_type.toLowerCase()}
                                  </Badge>
                               )}
                            </div>
                            <p className="text-muted-foreground text-xs font-sans mt-1">
                               {userProfile?.email}
                            </p>
                         </div>

                         {/* Bio/About */}
                         {userProfile?.profile?.about && (
                            <div className="space-y-2">
                               <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 font-sans">{t("about")}</h4>
                               <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 font-sans">
                                  {userProfile.profile.about}
                               </p>
                            </div>
                         )}

                         {/* Gallery Preview */}
                         {userProfile?.profile?.features_photos && userProfile.profile.features_photos.length > 0 && (
                            <div className="space-y-3">
                               <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 font-sans">{t("featuredWorks")}</h4>
                               <div className="grid grid-cols-2 gap-2">
                                  {userProfile.profile.features_photos.slice(0, 4).map((p: any) => (
                                     <div key={p.id} className="aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 group relative">
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
                               <Button asChild className="w-full gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold uppercase tracking-wider h-10" variant="default">
                                  <Link href={profileUrl}>
                                     {t("viewFullProfile")}
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
