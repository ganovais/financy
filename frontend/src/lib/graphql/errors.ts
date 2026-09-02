import { ClientError } from "graphql-request";

const FALLBACK_MESSAGE = "Algo deu errado. Tente novamente.";
const NETWORK_MESSAGE = "Não foi possível conectar ao servidor.";

export function getErrorCode(error: unknown) {
  if (!(error instanceof ClientError)) return undefined;
  const code = error.response.errors?.[0]?.extensions?.code;
  return typeof code === "string" ? code : undefined;
}

export function isUnauthenticated(error: unknown) {
  return getErrorCode(error) === "UNAUTHENTICATED";
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ClientError) {
    return error.response.errors?.[0]?.message ?? FALLBACK_MESSAGE;
  }
  if (error instanceof TypeError) return NETWORK_MESSAGE;
  return FALLBACK_MESSAGE;
}
