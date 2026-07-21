import { cookies } from "next/headers";
import type { User } from "@/types";

export const getSession = async () => {
  const cookieStore = await cookies();
  // Get the user data you stored in the cookie during login
  const authSession = cookieStore.get("artspace_auth_session")?.value;
  const initialData = authSession ? JSON.parse(authSession) : { user: null, accessToken: null };

  return initialData;
};

export function getMinimalUser(user: any): User | null {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    user_type: user.user_type,
    profile: user.profile ? {
      bio: user.profile.bio || "",
      about: user.profile.about || "",
      profile_picture: user.profile.profile_picture || null,
      cover_photo: user.profile.cover_photo || null,
      website: user.profile.website || "",
      show_email: !!user.profile.show_email,
      features_photos: [],
      is_following: false,
      isBlocked: false,
    } : {
      bio: "",
      about: "",
      profile_picture: null,
      cover_photo: null,
      website: "",
      show_email: false,
      features_photos: [],
      is_following: false,
      isBlocked: false,
    }
  };
}
