import * as React from "react";
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";

import { setToken, useToken } from "@/lib/auth-storage";
import { graphqlClient } from "@/lib/graphql/client";
import { ME } from "@/lib/graphql/operations";
import { queryKeys } from "@/lib/query-client";
import type { User } from "@/lib/types";

type AuthStatus = "loading" | "authenticated" | "anonymous" | "error";

interface AuthPayload {
  token: string;
  user: User;
}

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  signIn: (payload: AuthPayload, options?: { remember?: boolean }) => void;
  signOut: () => void;
  retry: () => void;
}

const meQuery = queryOptions({
  queryKey: queryKeys.me,
  queryFn: async (): Promise<User> => {
    const { me } = await graphqlClient.request(ME);
    return me;
  },
  staleTime: Infinity,
});

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = useToken();
  const queryClient = useQueryClient();
  const { data, isError, refetch } = useQuery({ ...meQuery, enabled: token !== null });

  const value = React.useMemo<AuthContextValue>(() => {
    const status: AuthStatus = !token
      ? "anonymous"
      : data
        ? "authenticated"
        : isError
          ? "error"
          : "loading";

    return {
      status,
      user: token && data ? data : null,
      signIn: ({ token: nextToken, user }, { remember = true } = {}) => {
        queryClient.setQueryData(queryKeys.me, user);
        setToken(nextToken, { persistent: remember });
      },
      signOut: () => {
        setToken(null);
        queryClient.clear();
      },
      retry: () => {
        void refetch();
      },
    };
  }, [token, data, isError, queryClient, refetch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export function useUser() {
  const { user } = useAuth();
  if (!user) throw new Error("useUser requires an authenticated session");
  return user;
}
