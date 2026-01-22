import { create } from "zustand";

interface ComingSoonState {
   open: boolean;
   title?: string;
   description?: string;
   openModal: (payload?: { title?: string; description?: string }) => void;
   closeModal: () => void;
}

export const useComingSoonStore = create<ComingSoonState>((set) => ({
   open: false,
   title: "Coming Soon",
   description: "This feature is currently under development.",
   openModal: (payload) =>
      set({
         open: true,
         ...payload,
      }),
   closeModal: () => set({ open: false }),
}));
