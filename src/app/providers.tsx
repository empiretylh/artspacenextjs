'use client'

import { ErrorFallback } from "@/components/error-fallback/error-fallback";
import GlobalProvider from "@/components/providers/global-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { getQueryClient } from "@/lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";

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

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
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
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
    // <Suspense fallback={<div>Loading...</div>}>
    // </Suspense>
  );
}
