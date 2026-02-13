"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "./store";
import { accessAnalytics, UserType } from "@/lib/analytics";

export function AuthInitializer() {
  const initialized = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const sync = async () => {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      useAuth.getState().init({ user: data.user, accessToken: data.accessToken });

      if (data.user) {
        accessAnalytics.setUser(String(data.user.id), data.user.user_type.toLocaleLowerCase() as UserType);
      }
    }

    if (!initialized.current) {
      sync();
      initialized.current = true;
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
