// lib/analytics/source-context.tsx
"use client";

import React, { createContext, useContext } from "react";

export type SourceContextValue<TSource extends string = string> = {
  source: TSource;
  sourceDetail?: string;
};

const SourceContext = createContext<SourceContextValue>({
  source: "unknown",
});

export function SourceProvider<TSource extends string>({
  value,
  children,
}: {
  value: SourceContextValue<TSource>;
  children: React.ReactNode;
}) {
  // Note: we widen to the base type for the single context instance
  return (
    <SourceContext.Provider value={value as SourceContextValue}>
      {children}
    </SourceContext.Provider>
  );
}

// Consumer can narrow with a generic at usage sites
export function useSource<TSource extends string = string>() {
  return useContext(SourceContext) as SourceContextValue<TSource>;
}
