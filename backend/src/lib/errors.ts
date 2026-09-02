import { GraphQLError } from "graphql";

export function unauthenticated() {
  return new GraphQLError("Não autenticado", {
    extensions: { code: "UNAUTHENTICATED" },
  });
}

export function invalidCredentials() {
  return new GraphQLError("Credenciais inválidas", {
    extensions: { code: "INVALID_CREDENTIALS" },
  });
}

export function emailTaken() {
  return new GraphQLError("E-mail já cadastrado", {
    extensions: { code: "EMAIL_TAKEN" },
  });
}

export function notFound(message: string) {
  return new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
}

export function badInput(message: string) {
  return new GraphQLError(message, {
    extensions: { code: "BAD_USER_INPUT" },
  });
}
