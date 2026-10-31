import Cookies from "js-cookie";

export const HOME_SEEN_KEY = "artspace_home_seen";

/**
 * Checks whether the user has previously visited/seen the home page.
 * Checks both localStorage and cookies for cross-environment compatibility.
 */
export function getHasSeenHome(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const local = localStorage.getItem(HOME_SEEN_KEY);
    if (local === "true") return true;
    const cookie = Cookies.get(HOME_SEEN_KEY);
    return cookie === "true";
  } catch {
    return false;
  }
}

/**
 * Marks the home page as seen in both localStorage and cookies (365 days expiry).
 */
export function setHasSeenHome(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HOME_SEEN_KEY, "true");
    Cookies.set(HOME_SEEN_KEY, "true", { expires: 365, path: "/" });
  } catch {
    // Ignore storage errors in private browsing modes
  }
}
