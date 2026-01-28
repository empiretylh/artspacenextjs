import { cookies } from "next/headers";

export const getSession = async () => {
  const cookieStore = await cookies();
  // Get the user data you stored in the cookie during login
  const authSession = cookieStore.get("artspace_auth_session")?.value;
  const initialData = authSession ? JSON.parse(authSession) : { user: null, accessToken: null };

  return initialData
}
