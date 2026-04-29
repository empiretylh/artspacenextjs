"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Minus, ChevronLeft } from "lucide-react";
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

  // Prevent SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide on main chat page
  const isChatPage = pathname?.startsWith("/chats");

  if (!mounted || isChatPage || !user) return null;

  const unreadCount = conversations.reduce((acc, conv) => {
    return acc + (conv.unreadCount?.[String(user.id)] || 0);
  }, 0);

  return (
    <div className="fixed bottom-1 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "flex flex-col overflow-hidden rounded-2xl border shadow-2xl transition-all duration-300",
              "bg-background/80 backdrop-blur-md",
              "w-[90vw] sm:w-[400px] max-h-[calc(100vh-100px)] h-[500px]"
            )}
          >
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between border-b bg-muted/30 px-2 py-1">
              <span className="pl-2 text-xs font-medium text-muted-foreground">Chat</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
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
                  <div>
                    <h3 className="font-semibold text-lg">Your Conversations</h3>
                    <p className="text-muted-foreground text-sm">
                      Select a chat to start messaging
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowList(true)}
                    variant="outline"
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
            "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
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
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-2 border-background animate-in zoom-in duration-300">
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
                className="h-14 w-auto px-6 rounded-full shadow-lg gap-2"
                onClick={() => setIsMinimized(false)}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Continue Chat</span>
                {unreadCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-primary text-[10px] font-bold">
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
