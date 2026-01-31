import Axios, { type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { useAuth } from "@/features/auth/store";
import { useNotifications } from "@/components/ui/notifications";
import Cookies from "js-cookie";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
   const cookie = JSON.parse(Cookies.get('artspace_auth_session') || "{}");
   const token = useAuth.getState().accessToken || cookie.accessToken;
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

let refreshing: Promise<string | null> | null = null;

api.interceptors.response.use(
   (resp) => resp,
   async (error) => {
      const original = error.config;

      if (error.response?.status === 401 &&
         !original._retry &&
         !original.url?.includes("/sign-in") &&
         !original.url?.includes("/refresh")) {
         original._retry = true;

         // We call our OWN Next.js API, which has access to the HttpOnly cookie
         refreshing ??= (async () => {
            try {
               const res = await fetch("/api/auth/refresh", { method: "POST" });
               const data = await res.json();

               if (!res.ok) throw new Error();

               // Update Zustand with the new short-lived access token
               useAuth.setState({ accessToken: data.access });
               return data.access;
            } catch {
               // Global logout on failure
               useAuth.getState().logout();
               return null;
            } finally {
               refreshing = null;
            }
         })();

         const token = await refreshing;
         if (token) {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
         }
      }

      console.log(error)

      const message = error.response?.data?.detail || error.message;
      if (error.response?.status !== 404 && document) {
         useNotifications.getState().addNotification({
            type: "error",
            title: "Error",
            message,
         });
      }

      return Promise.reject(error);
   }
);
