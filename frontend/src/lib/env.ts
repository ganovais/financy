import { z } from "zod";

const envSchema = z.object({
  VITE_BACKEND_URL: z.url("VITE_BACKEND_URL inválida").default("http://localhost:4000"),
});

export const env = envSchema.parse(import.meta.env);

export const GRAPHQL_URL = new URL("/graphql", env.VITE_BACKEND_URL).href;
