import { isServer, QueryClient } from "@tanstack/react-query";
import { queryConfig } from "./react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: queryConfig
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
  }
}
