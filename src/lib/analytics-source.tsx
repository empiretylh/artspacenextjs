// lib/analytics/source-context.tsx
"use client";

import React, { createContext, useContext } from "react";
import { AnalyticsSource } from "./analytics";

export type SourceContextValue = {
  source: AnalyticsSource;
  sourceDetail?: string;
};

const SourceContext = createContext<SourceContextValue>({
  source: "unknown",
});

export function SourceProvider<AnalyticsSource extends string>({
  value,
  children,
}: {
  value: SourceContextValue;
  children: React.ReactNode;
}) {
  // Note: we widen to the base type for the single context instance
  return (
    <SourceContext.Provider value={value}>
      {children}
    </SourceContext.Provider>
  );
}

// Consumer can narrow with a generic at usage sites
export function useSource() {
  return useContext(SourceContext);
}
