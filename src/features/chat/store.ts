import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
  showList: boolean;
  activeConversationId: string | null;
  pendingRecipientId: string | null;
  
  setIsOpen: (isOpen: boolean) => void;
  setIsMinimized: (isMinimized: boolean) => void;
  setShowList: (showList: boolean) => void;
  setActiveConversationId: (id: string | null) => void;
  setPendingRecipientId: (id: string | null) => void;
  
  toggleChat: () => void;
  closeChat: () => void;
  openConversation: (convId: string) => void;
  startNewChat: (recipientId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      isOpen: false,
      isMinimized: true,
      showList: false,
      activeConversationId: null,
      pendingRecipientId: null,

      setIsOpen: (isOpen) => set({ isOpen }),
      setIsMinimized: (isMinimized) => set({ isMinimized }),
      setShowList: (showList) => set({ showList }),
      setActiveConversationId: (id) => set({ 
        activeConversationId: id, 
        pendingRecipientId: null,
        isOpen: !!id,
        isMinimized: false,
        showList: false
      }),
      setPendingRecipientId: (id) => set({ 
        pendingRecipientId: id, 
        activeConversationId: null,
        isOpen: !!id,
        isMinimized: false,
        showList: false
      }),

      toggleChat: () => set((state) => ({ isMinimized: !state.isMinimized, isOpen: true })),
      closeChat: () => set({ isOpen: false, activeConversationId: null, pendingRecipientId: null, showList: false }),
      
      openConversation: (convId) => set({ 
        activeConversationId: convId, 
        pendingRecipientId: null, 
        isOpen: true, 
        isMinimized: false,
        showList: false
      }),
      
      startNewChat: (recipientId) => set({ 
        pendingRecipientId: recipientId, 
        activeConversationId: null, 
        isOpen: true, 
        isMinimized: false,
        showList: false
      }),
    }),
    {
      name: "artspace-chat-state",
      partialize: (state) => ({
        activeConversationId: state.activeConversationId,
        pendingRecipientId: state.pendingRecipientId,
        isMinimized: state.isMinimized,
        isOpen: state.isOpen,
        showList: state.showList,
      }),
    }
  )
);
