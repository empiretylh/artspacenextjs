import { authAnalytics } from "@/lib/analytics";
import { getQueryClient } from "@/lib/get-query-client";
import type { User } from "@/types";
import type { AxiosError } from "axios";
import axios from "axios";
import { signInWithCustomToken, signOut as firebaseSignOut } from "firebase/auth";
import { create } from "zustand";
import { auth as firebaseAuth } from "@/features/service/firebase/firebase";
import { env } from "@/config/env";

interface RegisterForm {
   email: string;
   password: string;
   first_name?: string;
   last_name?: string;
   user_type?: "BUYER" | "COLLECTOR" | "ARTIST" | "GALLERY";
   phone?: string;
}

export type State = {
   user: User | null;
   accessToken: string | null | undefined;
   firebaseToken: string | null | undefined;
   loading: boolean;
   isLoginDialogOpen: boolean;
   isRegisterDialogOpen: boolean;
   setLoginDialogOpen: (isOpen: boolean) => void;
   setRegisterDialogOpen: (isOpen: boolean) => void;
   login: (
      email: string,
      password: string
   ) => Promise<User | AxiosError<{ message: string }>>;
   register: (
      values: RegisterForm
   ) => Promise<boolean | AxiosError<{ message: string }>>;
   logout: () => Promise<boolean>;
   init: (data: { user: User | null; accessToken: string | null; firebaseToken: string | null }) => void;
   isBuyer: boolean;
   isArtist: boolean;
   isCollector: boolean;
};

export const useAuth = create<State>((set) => {
   const stored = {
      user: {
         id: 0,
         user_type: "BUYER",
         email: "", // add the missing properties
         first_name: "",
         last_name: "",
         profile: null,
      } as unknown as User | null,
      accessToken: undefined,
      firebaseToken: undefined,
   };

   return {
      user: null,
      accessToken: stored.accessToken,
      firebaseToken: stored.firebaseToken,
      loading: true,
      isBuyer: stored?.user?.user_type === "BUYER",
      isArtist: stored?.user?.user_type === "ARTIST",
      isCollector: stored?.user?.user_type === "COLLECTOR",
      isLoginDialogOpen: false,
      isRegisterDialogOpen: false,

      setLoginDialogOpen: (isOpen) => set({ isLoginDialogOpen: isOpen }),
      setRegisterDialogOpen: (isOpen) => set({ isRegisterDialogOpen: isOpen }),

      async login(email, password) {
         const queryClient = getQueryClient()
         try {
            const { data, status } = await axios.post("/api/auth/login", {
               email, password
            })

            // 1. SILENT FIREBASE HANDSHAKE
            if (env.FIREBASE_ENABLE && firebaseAuth && data.firebaseToken) {
               await signInWithCustomToken(firebaseAuth, data.firebaseToken);

               if (env.NODE_ENV === 'development') {
                  console.log("Firebase session re-synced from login API");
               }
            }

            const newState = {
               accessToken: data.access,
               firebaseToken: data.firebaseToken,
               user: data.user,
               isBuyer: data.user.user_type === "BUYER",
               isArtist: data.user.user_type === "ARTIST",
               isCollector: data.user.user_type === "COLLECTOR",
            };
            set(newState);

            queryClient.invalidateQueries();

            return data.user as User
         } finally {
            set({ loading: false });
         }
      },

      async register(values) {
         try {
            set({ loading: true });

            const { data } = await axios.post("/api/auth/register", {
               email: values.email,
               password: values.password,
               first_name: values.first_name,
               last_name: values.last_name,
               user_type: values.user_type,
               phone_number: values.phone, // Map to backend key
            });

            return true;
         } catch (error) {
            return error as AxiosError<{ message: string }>;
         } finally {
            set({ loading: false });
         }
      },

      async logout() {
         await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
         });

         if (env.FIREBASE_ENABLE && firebaseAuth) {
            await firebaseSignOut(firebaseAuth)

            if (env.NODE_ENV === 'development') {
               console.log('Firebase signed out')
            }
         }

         authAnalytics.logout('profile_menu')

         set({
            user: null,
            accessToken: null,
            loading: false,
         });

         return true;
      },

      init: (data: { user: User | null, accessToken: string | null }) => {
         set({
            ...data,
            isBuyer: data.user?.user_type === "BUYER",
            isArtist: data.user?.user_type === "ARTIST",
            isCollector: data.user?.user_type === "COLLECTOR",
            loading: false
         });
      },
   };
});
