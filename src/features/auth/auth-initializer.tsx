"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./store";
import { env } from "@/config/env";

export function AuthInitializer() {
  const initialized = useRef(false);

  useEffect(() => {
    const sync = async () => {
      const res = await fetch(env.APP_URL + '/api/auth/session');
      const data = await res.json();
      useAuth.getState().init({ user: data.user, accessToken: data.accessToken });
    }

    if (!initialized.current) {
      sync();
      initialized.current = true;
    }
  }, []);

  return null;
}
