import Axios, { type InternalAxiosRequestConfig } from "axios";

import { useNotifications } from "@/components/ui/notifications";
import { env } from "@/config/env";
import { State, useAuth } from "@/features/auth/store";
import {
   login as apiLogin,
   logout as apiLogout,
   register as apiRegister,
   getMe,
   refresh as apiRefresh,
} from "@/features/auth/api";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
   const token = useAuth.getState().accessToken;
   if (config.headers) {
      config.headers.Accept = "application/json";
   }

   if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
   }

   config.withCredentials = false;
   return config;
}

export const api = Axios.create({
   baseURL: env.API_URL + "/api/v1",
});

api.interceptors.request.use(authRequestInterceptor);
// api.interceptors.response.use(
//    (response) => {
//       return response;
//    },
//    (error) => {
//       const message = error.response?.data?.message || error.message;
//       useNotifications.getState().addNotification({
//          type: "error",
//          title: "Error",
//          message,
//       });

//       // if (error.response?.status === 401) {
//       //    const searchParams = new URLSearchParams();
//       //    const redirectTo =
//       //       searchParams.get("redirectTo") || window.location.pathname;
//       //    window.location.href = paths.auth.login.getHref(redirectTo);
//       // }

//       return Promise.reject(error);
//    }
// );

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

let refreshing: Promise<string | null> | null = null;

if (api) {
   api.interceptors.response.use(
      (resp) => resp, // normal response
      async (error) => {
         const original = error.config;

         if (
            error.response?.status === 401 &&
            !original._retry &&
            !original.url?.includes("/sign-in") &&
            !original.url?.includes("/refresh")
         ) {
            original._retry = true;

            refreshing ??= (async () => {
               try {
                  const { access: accessToken } = await apiRefresh(
                     useAuth.getState().refreshToken
                  );
                  useAuth.setState({ accessToken });
                  const data = useAuth.getState();
                  saveToStorage({
                     accessToken,
                     refreshToken: data.refreshToken,
                     user: data.user,
                  });
                  return accessToken;
               } catch {
                  useAuth.setState({
                     accessToken: null,
                     user: null,
                     refreshToken: null,
                  });
                  saveToStorage({
                     accessToken: null,
                     refreshToken: null,
                     user: null,
                  });
                  return null;
               } finally {
                  refreshing = null;
               }
            })();

            const token = await refreshing;

            if (token) {
               const retryConfig = {
                  ...original,
                  headers: {
                     ...original.headers,
                     Authorization: `Bearer ${token}`,
                  },
               };
               // ✅ Return the retried request, don’t reject yet
               return api(retryConfig);
            }
         } else {
            let message = error.response?.data?.message || error.message;
            let title = "Error";
            if (error.response.data.detail) message = error.response.data.detail;

            if (error.code === "ERR_NETWORK") {
               title = "Network Error";
               message =
                  "It looks like your browser or a browser extension may be blocking updates. " +
                  "Try disabling extensions or using a private/incognito window to continue.";
            }

            if (error.response.status !== 404) {
               useNotifications.getState().addNotification({
                  type: "error",
                  title,
                  message,
               });
            }
         }

         // Only reject if refresh failed or it’s another error
         return Promise.reject(error);
      }
   );
}
