// components/chat/chat-list.tsx
"use client";

import { useState, useMemo } from "react";
import { useConversations } from "../hooks/use-conversations";
import { ChatListItem } from "./chat-list-item";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/store";
import { useTranslations } from "next-intl";

type Props = {
   activeId: string | null;
   onSelect: (id: string) => void;
 };

export const ChatList = ({ activeId, onSelect }: Props) => {
   const { conversations, loading } = useConversations();
   const { user: currentUser } = useAuth();
   const [searchQuery, setSearchQuery] = useState("");
   const [isSearching, setIsSearching] = useState(false);
   const t = useTranslations("Chat");

   const filteredConversations = useMemo(() => {
      if (!searchQuery.trim()) return conversations;
      
      const query = searchQuery.toLowerCase();
      return conversations.filter((conv) => {
         // Search in participant names (other than current user)
         const otherParticipants = Object.values(conv.participantDetails).filter(
            (p) => p.id !== String(currentUser?.id)
         );
         
         return otherParticipants.some((p) => 
            p.name.toLowerCase().includes(query)
         );
      });
   }, [conversations, searchQuery, currentUser?.id]);

   const toggleSearch = () => {
      if (isSearching) {
         setSearchQuery("");
      }
      setIsSearching(!isSearching);
   };

   return (
      <div className="flex h-full flex-col">
         <div className="border-b px-4 py-2">
            <div className="flex items-center justify-between h-10">
               {!isSearching ? (
                  <>
                     <h2 className="text-sm font-semibold">{t("messages")}</h2>
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={toggleSearch}
                     >
                        <Search className="h-4 w-4" />
                     </Button>
                  </>
               ) : (
                  <div className="flex items-center gap-2 w-full">
                     <div className="relative flex-1">
                        <Input
                           autoFocus
                           placeholder={t("searchPlaceholder")}
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="h-8 pr-8 text-xs"
                        />
                        {searchQuery && (
                           <button
                              onClick={() => setSearchQuery("")}
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                           >
                              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                           </button>
                        )}
                     </div>
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-xs"
                        onClick={toggleSearch}
                     >
                        {t("cancel")}
                     </Button>
                  </div>
               )}
            </div>
         </div>

         <div className="flex-1 overflow-y-auto">
            {loading ? (
               <div className="flex p-4 justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
               </div>
            ) : filteredConversations.length === 0 ? (
               <div className="p-8 text-center text-xs text-muted-foreground">
                  {searchQuery ? t("noResults") : t("noConversations")}
               </div>
            ) : (
               filteredConversations.map((conv) => (
                  <ChatListItem
                     key={conv.id}
                     conversation={conv}
                     isActive={conv.id === activeId}
                     onClick={() => onSelect(conv.id)}
                  />
               ))
            )}
         </div>
      </div>
   );
};
