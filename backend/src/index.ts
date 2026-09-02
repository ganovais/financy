import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";

import { env } from "./env.ts";
import { buildContext, type Context } from "./graphql/context.ts";
import { resolvers } from "./graphql/resolvers.ts";
import { typeDefs } from "./graphql/schema.ts";

const yoga = createYoga({
  schema: createSchema<Context>({ typeDefs, resolvers }),
  context: buildContext,
  graphqlEndpoint: "/graphql",
  landingPage: false,
  cors: {
    origin: env.CORS_ORIGIN.split(","),
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
  },
});

const server = createServer(yoga);

server.listen(env.PORT, () => {
  console.log(`🚀 GraphQL pronto em http://localhost:${env.PORT}/graphql`);
});
