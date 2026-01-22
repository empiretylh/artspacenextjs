
'use client'
import { useAuth } from "@/features/auth/store";
import ComingSoonModal from "@/features/coming-soon/components/coming-soon-modal";
import { useEffect } from "react";

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const { init } = useAuth();

  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      localStorage.setItem("theme", prefersDarkMode ? "dark" : "light");
    }

    init();
  }, []);

  return (
    <div>
      <ComingSoonModal />
      {children}
    </div>
  );
};

export default GlobalProvider;
