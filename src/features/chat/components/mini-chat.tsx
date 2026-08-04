"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Minus } from "lucide-react";
import { useChatStore } from "../store";
import { ChatWindow } from "./chat-window";
import { ChatList } from "./chat-list";
import { Button } from "@/components/ui/button";
import { useConversations } from "../hooks/use-conversations";
import { useAuth } from "@/features/auth/store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const MiniChat = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { conversations } = useConversations();
  const [mounted, setMounted] = useState(false);

  const {
    isOpen,
    isMinimized,
    showList,
    activeConversationId,
    pendingRecipientId,
    setIsOpen,
    setIsMinimized,
    setShowList,
    setActiveConversationId,
    closeChat
  } = useChatStore();

  const [hasVisitedChats, setHasVisitedChats] = useState(false);

  // Prevent SSR hydration mismatch and check sessionStorage
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const visited = sessionStorage.getItem("artspace_chats_visited") === "true";
      setHasVisitedChats(visited);
    }
  }, []);

  // Hide on main chat page (supports localized paths like /en/chats)
  const isChatPage = pathname?.split("/").includes("chats");

  // Track if user visited the chats page in this session
  useEffect(() => {
    if (isChatPage && typeof window !== "undefined") {
      sessionStorage.setItem("artspace_chats_visited", "true");
      setHasVisitedChats(true);
    }
  }, [isChatPage]);

  if (!mounted || isChatPage || !user || !hasVisitedChats) return null;

  const unreadCount = conversations.reduce((acc, conv) => {
    return acc + (conv.unreadCount?.[String(user.id)] || 0);
  }, 0);

  return (
    <div className="fixed bottom-3 right-3 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "flex flex-col overflow-hidden rounded-2xl border border-border/80 shadow-2xl transition-all duration-300",
              "bg-background/80 backdrop-blur-md",
              "w-[90vw] sm:w-[400px] max-h-[calc(100vh-100px)] h-[500px]"
            )}
          >
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between border-b border-border bg-muted/10 px-2 py-1.5">
              <span className="pl-2 text-xs font-bold font-display uppercase tracking-wider text-muted-foreground/80">Chat</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10"
                  onClick={closeChat}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden flex flex-col relative">
              {showList ? (
                <div className="flex-1 overflow-hidden">
                  <ChatList
                    activeId={activeConversationId}
                    onSelect={(id) => setActiveConversationId(id)}
                  />
                </div>
              ) : (activeConversationId || pendingRecipientId) ? (
                <ChatWindow
                  variant="mini"
                  onBack={() => setShowList(true)}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg font-display tracking-tight text-foreground">Your Conversations</h3>
                    <p className="text-muted-foreground text-sm font-sans">
                      Select a chat to start messaging
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowList(true)}
                    variant="outline"
                    className="rounded-full border-border text-xs uppercase tracking-wider font-semibold px-4"
                  >
                    View Chat List
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.div
        layout
        className="relative"
      >
        <Button
          size="icon"
          className={cn(
            "h-14 w-14 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg border border-primary/10 transition-all duration-300",
            isOpen && !isMinimized ? "rotate-90 scale-90 opacity-0 pointer-events-none" : "scale-100 opacity-100"
          )}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            if (!activeConversationId && !pendingRecipientId) {
              setShowList(true);
            }
          }}
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground border-2 border-background animate-in zoom-in duration-300">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>

        {/* Small minimized bar if chat is open but minimized */}
        <AnimatePresence>
          {isOpen && isMinimized && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute bottom-0 right-0"
            >
              <Button
                className="h-14 w-auto px-6 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground border border-primary/10 shadow-lg gap-2"
                onClick={() => setIsMinimized(false)}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm font-semibold font-sans tracking-wide">Continue Chat</span>
                {unreadCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
