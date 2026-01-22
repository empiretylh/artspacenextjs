import type { DefaultOptions, UseMutationOptions } from "@tanstack/react-query";

export const queryConfig = {
   queries: {
      // throwOnError: true,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60,
   },
} satisfies DefaultOptions;

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
   Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
   ReturnType<T>,
   "queryKey" | "queryFn"
>;

export type MutationConfig<
   MutationFnType extends (...args: any) => Promise<any>,
> = Omit<
   UseMutationOptions<
      ApiFnReturnType<MutationFnType>,
      Error,
      MutationFnType extends () => any ? void : Parameters<MutationFnType>[0]
   >,
   "mutationFn"
>;
