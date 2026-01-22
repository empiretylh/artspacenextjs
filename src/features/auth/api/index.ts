import { api } from "@/lib/api-client";
import { generateFormdata } from "@/lib/utils";
import type { User } from "@/types";

export async function login(email: string, password: string) {
   const { data } = await api.post<{
      access: string;
      refresh: string;
      user: User;
   }>("/users/auth/login/", { email, password });
   return data;
}

export async function refresh(token: string | null) {
   const { data } = await api.post<{ access: string }>(
      "/users/auth/token/refresh/",
      generateFormdata({ refresh: token })
   );
   return data;
}

export async function logout() {
   await api.post("/users/auth/logout");
}

export async function register({
   email,
   password,
   first_name,
   last_name,
   user_type,
   phone,
}: {
   email: string;
   password: string;
   first_name?: string;
   last_name?: string;
   user_type?: "BUYER" | "COLLECTOR" | "ARTIST" | "GALLERY";
   phone?: string;
}) {
   const { data } = await api.post<{ accessToken: string; user: User }>(
      "/users/auth/register/",
      {
         email,
         password,
         first_name,
         last_name,
         user_type,
         phone_number: phone,
      }
   );

   return data;
}

export async function getMe() {
   const { data } = await api.get<User>("/users/profile/me/");
   return data;
}
