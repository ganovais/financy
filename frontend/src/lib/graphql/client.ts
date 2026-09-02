import { GraphQLClient } from "graphql-request";

import { getToken } from "@/lib/auth-storage";
import { GRAPHQL_URL } from "@/lib/env";

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { authorization: `Bearer ${token}` } : {};
}

export const graphqlClient = new GraphQLClient(GRAPHQL_URL, {
  headers: authHeaders,
});
