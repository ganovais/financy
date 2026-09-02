import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { ClientError } from "graphql-request";

import { setToken } from "@/lib/auth-storage";
import { isUnauthenticated } from "@/lib/graphql/errors";

export const queryKeys = {
  me: ["me"],
  categories: ["categories"],
  transactions: ["transactions"],
} as const;

function handleError(error: unknown) {
  if (isUnauthenticated(error)) setToken(null);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) =>
        !(error instanceof ClientError) && failureCount < 2,
    },
  },
  queryCache: new QueryCache({ onError: handleError }),
  mutationCache: new MutationCache({ onError: handleError }),
});

export function invalidateLedger(client: QueryClient) {
  return Promise.all([
    client.invalidateQueries({ queryKey: queryKeys.categories }),
    client.invalidateQueries({ queryKey: queryKeys.transactions }),
  ]);
}
