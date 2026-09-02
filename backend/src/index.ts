import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";

import { env } from "./env.ts";
import { buildContext, type Context } from "./graphql/context.ts";
import { resolvers } from "./graphql/resolvers.ts";
import { typeDefs } from "./graphql/schema.ts";

const allowedOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const fallbackOrigin = allowedOrigins[0] ?? "http://localhost:5173";
const localOrigin = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

function isAllowedOrigin(origin: string) {
  if (allowedOrigins.includes(origin)) return true;
  return env.NODE_ENV !== "production" && localOrigin.test(origin);
}

const yoga = createYoga({
  schema: createSchema<Context>({ typeDefs, resolvers }),
  context: buildContext,
  graphqlEndpoint: "/graphql",
  landingPage: false,
  cors: (request) => {
    const origin = request.headers.get("origin");
    return {
      origin: origin && isAllowedOrigin(origin) ? origin : fallbackOrigin,
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
    };
  },
});

const server = createServer(yoga);

server.listen(env.PORT, () => {
  console.log(`🚀 GraphQL pronto em http://localhost:${env.PORT}/graphql`);
});
