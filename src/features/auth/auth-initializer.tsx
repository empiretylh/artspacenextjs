"use client";
import { useRef } from "react";
import { useAuth } from "./store";

export function AuthInitializer({ data }: { data: any }) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useAuth.getState().init(data);
    initialized.current = true;
  }
  return null;
}
