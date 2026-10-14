import { create } from "zustand";

interface NotificationStoreState {
   isDropdownOpen: boolean;
   setIsDropdownOpen: (open: boolean) => void;
   activeTab: "all" | "unread";
   setActiveTab: (tab: "all" | "unread") => void;
}

export const useNotificationStore = create<NotificationStoreState>((set) => ({
   isDropdownOpen: false,
   setIsDropdownOpen: (open) => set({ isDropdownOpen: open }),
   activeTab: "all",
   setActiveTab: (tab) => set({ activeTab: tab }),
}));
