'use client'

import { ErrorFallback } from "@/components/error-fallback/error-fallback";
import GlobalProvider from "@/components/providers/global-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { getQueryClient } from "@/lib/get-query-client";
import {
  createQueryCachePersister,
  QUERY_CACHE_BUSTER,
  QUERY_CACHE_MAX_AGE,
} from "@/lib/query-persistence";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Capacitor } from "@capacitor/core";
import { env } from "@/config/env";

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
   * Restores the persisted cache before queries subscribe and saves it back on
   * every cache change, so previously loaded screens stay usable offline.
   * On the server this is a no-op persister; localStorage is only used in the
   * browser / Capacitor WebView.
   */
  const [persister] = React.useState(createQueryCachePersister);

  /**
   * Tag the document when running inside the Capacitor shell so that
   * safe-area (notch/status bar/home indicator) styles apply only in the app
   * and never on the regular website.
   */
  React.useEffect(() => {
    document.documentElement.classList.toggle(
      "capacitor-native",
      Capacitor.isNativePlatform()
    );
  }, []);

  return (
    <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister,
            maxAge: QUERY_CACHE_MAX_AGE,
            buster: QUERY_CACHE_BUSTER,
          }}
        >
          <Toaster richColors className="[&>li]:w-full" />
          <GlobalProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </GlobalProvider>
        </PersistQueryClientProvider>
      </ErrorBoundary>
    </GoogleOAuthProvider>
    // <Suspense fallback={<div>Loading...</div>}>
    // </Suspense>
  );
}
