'use client'

import { ErrorFallback } from "@/components/error-fallback/error-fallback";
import { Skeleton } from "@/components/ui/skeleton";
import { queryConfig } from "@/lib/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import GlobalProvider from "@/components/providers/global-provider";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import { getQueryClient } from "@/lib/get-query-client";

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
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <Toaster richColors className="[&>li]:w-full" />
          <GlobalProvider>
            <ScrollToTop />
            {children}
          </GlobalProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense >
  );
}
