import { useNotifications } from "@/components/ui/notifications";
import { create } from "zustand";

export type CartItem = {
   id: string;
   title: string;
   price: string;
   image: string;
   quantity: number;
};

type CartState = {
   items: CartItem[];
   addToCart: (item: Omit<CartItem, "quantity">) => void;
   removeFromCart: (id: string) => void;
   increaseQty: (id: string) => void;
   decreaseQty: (id: string) => void;
   getTotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
   items: [],
   addToCart: (item) =>
      set((state) => {
         const existing = state.items.find((i) => i.id === item.id);
         if (existing) {
            useNotifications.getState().addNotification({
               type: "error",
               title: "Item already in cart",
               message: "Only one of each item can be added to the cart.",
            });
            return { items: state.items };
         }
         return { items: [...state.items, { ...item, quantity: 1 }] };
      }),
   removeFromCart: (id) =>
      set((state) => ({
         items: state.items.filter((i) => i.id !== id),
      })),
   increaseQty: (id) =>
      set((state) => ({
         items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
         ),
      })),
   decreaseQty: (id) =>
      set((state) => ({
         items: state.items
            .map((i) =>
               i.id === id ? { ...i, quantity: Math.max(i.quantity - 1, 1) } : i
            )
            .filter((i) => i.quantity > 0),
      })),
   getTotal: () => {
      const { items } = get();
      return items.reduce((acc, i) => acc + Number(i.price) * i.quantity, 0);
   },
}));
