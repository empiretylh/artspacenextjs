import type { User } from "@/types";
import { create } from "zustand";
import {
   login as apiLogin,
   logout as apiLogout,
   register as apiRegister,
   getMe,
   refresh as apiRefresh,
} from "./api";
import { api } from "@/lib/api-client";
import { useNotifications } from "@/components/ui/notifications";
import type { AxiosError } from "axios";

interface RegisterForm {
   email: string;
   password: string;
   first_name?: string;
   last_name?: string;
   user_type?: "BUYER" | "COLLECTOR" | "ARTIST" | "GALLERY";
}

export type State = {
   user: User | null;
   accessToken: string | null;
   refreshToken: string | null;
   loading: boolean;
   isLoginDialogOpen: boolean;
   isRegisterDialogOpen: boolean;
   setLoginDialogOpen: (isOpen: boolean) => void;
   setRegisterDialogOpen: (isOpen: boolean) => void;
   login: (
      email: string,
      password: string
   ) => Promise<boolean | AxiosError<{ message: string }>>;
   register: (
      values: RegisterForm
   ) => Promise<boolean | AxiosError<{ message: string }>>;
   logout: () => Promise<void>;
   init: () => Promise<void>;
   isBuyer: boolean;
   isArtist: boolean;
   isCollector: boolean;
};

// LocalStorage helpers
const STORAGE_KEY = "auth_state";

function saveToStorage(state: Partial<State>) {
   localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
         accessToken: state.accessToken,
         refreshToken: state.refreshToken,
         user: state.user,
      })
   );
}

export function loadFromStorage(): Pick<
   State,
   "accessToken" | "user" | "refreshToken"
> {
   try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { accessToken: null, user: null, refreshToken: null };
      return JSON.parse(raw);
   } catch {
      return { accessToken: null, user: null, refreshToken: null };
   }
}

export const useAuth = create<State>((set) => {
   const stored = loadFromStorage();
   return {
      user: stored.user,
      accessToken: stored.accessToken,
      refreshToken: stored.refreshToken,
      loading: true,
      isBuyer: stored?.user?.user_type === "BUYER",
      isArtist: stored?.user?.user_type === "ARTIST",
      isCollector: stored?.user?.user_type === "COLLECTOR",
      isLoginDialogOpen: false,
      isRegisterDialogOpen: false,

      setLoginDialogOpen: (isOpen) => set({ isLoginDialogOpen: isOpen }),
      setRegisterDialogOpen: (isOpen) => set({ isRegisterDialogOpen: isOpen }),

      async login(email, password) {
         try {
            const data = await apiLogin(email, password);
            const newState = {
               accessToken: data.access,
               refreshToken: data.refresh,
               user: data.user,
               isBuyer: data.user.user_type === "BUYER",
               isArtist: data.user.user_type === "ARTIST",
            };
            saveToStorage(newState);
            set(newState);
            return true;
         } catch (error) {
            return error as AxiosError<{ message: string }>;
         } finally {
            set({ loading: false });
         }
      },

      async register(values) {
         try {
            const data = await apiRegister(values);
            // const newState = { accessToken: data.accessToken, user: data.user };
            // saveToStorage(newState);
            // set(newState);
            return true;
         } catch (error) {
            return error as AxiosError<{ message: string }>;
         } finally {
            set({ loading: false });
         }
      },

      async logout() {
         // try {
         //    await apiLogout();
         // } catch {
         //    // ignore
         // }
         saveToStorage({ accessToken: null, refreshToken: null, user: null });
         set({ accessToken: null, refreshToken: null, user: null });
      },

      async init() {
         if (useAuth.getState().refreshToken) {
            try {
               // Try silent refresh on app load
               const r = await apiRefresh(useAuth.getState().refreshToken);
               set({ accessToken: r.access });
               const me = await getMe();
               set({ user: me });
               saveToStorage({
                  accessToken: r.access,
                  user: me,
                  refreshToken: useAuth.getState().refreshToken,
               });
            } catch {
               set({ user: null, accessToken: null, refreshToken: null });
               saveToStorage({
                  accessToken: null,
                  refreshToken: null,
                  user: null,
               });
            } finally {
               set({ loading: false });
            }
         } else {
            set({ loading: false });
         }
      },
   };
});
