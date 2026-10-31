'use client'

import { ErrorFallback } from "@/components/error-fallback/error-fallback";
import GlobalProvider from "@/components/providers/global-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { getQueryClient } from "@/lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Capacitor } from "@capacitor/core";
import { env } from "@/config/env";
import { NavigationHistoryTracker } from "@/hooks/use-safe-back";

interface IProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: Readonly<IProviderProps>) {
  /**
   * `queryClient` instance is stored in the component's state and will persist across re-renders.
   * This approach avoids creating a new QueryClient instance on every render,
   * which would be inefficient and could lead to unexpected behavior. 💁‍♂️
   */
  const queryClient = getQueryClient();

  /**
   * Tag the document when running inside the Capacitor shell so that
   * safe-area (notch/status bar/home indicator) styles apply only in the app
   * and never on the regular website.
   */
  React.useEffect(() => {
    const isNative = Capacitor.isNativePlatform();
    const root = document.documentElement;
    root.classList.toggle("capacitor-native", isNative);
    root.classList.toggle(
      "capacitor-ios",
      isNative && Capacitor.getPlatform() === "ios"
    );
  }, []);

  return (
    <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <Toaster richColors className="[&>li]:w-full" />
          <GlobalProvider>
            <NavigationHistoryTracker />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </GlobalProvider>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </ErrorBoundary>
    </GoogleOAuthProvider>
    // <Suspense fallback={<div>Loading...</div>}>
    // </Suspense>
  );
}
