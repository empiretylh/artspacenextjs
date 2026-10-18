import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
  showList: boolean;
  activeConversationId: string | null;
  pendingRecipientId: string | null;
  userId: string | null;
  
  setIsOpen: (isOpen: boolean) => void;
  setIsMinimized: (isMinimized: boolean) => void;
  setShowList: (showList: boolean) => void;
  setActiveConversationId: (id: string | null, userId?: string | null) => void;
  setPendingRecipientId: (id: string | null, userId?: string | null) => void;
  
  toggleChat: () => void;
  closeChat: () => void;
  openConversation: (convId: string, userId?: string | null) => void;
  startNewChat: (recipientId: string, userId?: string | null) => void;
  syncUserSession: (currentUserId: string | null) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      isOpen: false,
      isMinimized: true,
      showList: false,
      activeConversationId: null,
      pendingRecipientId: null,
      userId: null,

      setIsOpen: (isOpen) => set({ isOpen }),
      setIsMinimized: (isMinimized) => set({ isMinimized }),
      setShowList: (showList) => set({ showList }),
      setActiveConversationId: (id, userId) => set((state) => ({ 
        activeConversationId: id, 
        pendingRecipientId: null,
        isOpen: !!id,
        isMinimized: false,
        showList: false,
        ...(userId ? { userId } : {})
      })),
      setPendingRecipientId: (id, userId) => set((state) => ({ 
        pendingRecipientId: id, 
        activeConversationId: null,
        isOpen: !!id,
        isMinimized: false,
        showList: false,
        ...(userId ? { userId } : {})
      })),

      toggleChat: () => set((state) => ({ isMinimized: !state.isMinimized, isOpen: true })),
      closeChat: () => set({ 
        isOpen: false, 
        isMinimized: true, 
        activeConversationId: null, 
        pendingRecipientId: null, 
        showList: false,
        userId: null 
      }),
      
      openConversation: (convId, userId) => set({ 
        activeConversationId: convId, 
        pendingRecipientId: null, 
        isOpen: true, 
        isMinimized: false,
        showList: false,
        ...(userId ? { userId } : {})
      }),
      
      startNewChat: (recipientId, userId) => set({ 
        pendingRecipientId: recipientId, 
        activeConversationId: null, 
        isOpen: true, 
        isMinimized: false,
        showList: false,
        ...(userId ? { userId } : {})
      }),

      syncUserSession: (currentUserId) => {
        set((state) => {
          if (!currentUserId || (state.userId && state.userId !== currentUserId)) {
            return {
              isOpen: false,
              isMinimized: true,
              showList: false,
              activeConversationId: null,
              pendingRecipientId: null,
              userId: currentUserId,
            };
          }
          if (currentUserId && !state.userId) {
            return { userId: currentUserId };
          }
          return {};
        });
      },
    }),
    {
      name: "artspace-chat-state",
      partialize: (state) => ({
        activeConversationId: state.activeConversationId,
        pendingRecipientId: state.pendingRecipientId,
        isMinimized: state.isMinimized,
        isOpen: state.isOpen,
        showList: state.showList,
        userId: state.userId,
      }),
    }
  )
);
