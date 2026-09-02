import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { LoginInput, RegisterInput, UpdateProfileInput } from "@/gql/graphql";
import { graphqlClient } from "@/lib/graphql/client";
import { getErrorMessage } from "@/lib/graphql/errors";
import { LOGIN, REGISTER, UPDATE_PROFILE } from "@/lib/graphql/operations";
import { queryKeys } from "@/lib/query-client";

const notifyError = (error: unknown) => toast.error(getErrorMessage(error));

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginInput) => graphqlClient.request(LOGIN, { data }),
    onSuccess: () => toast.success("Login realizado com sucesso"),
    onError: notifyError,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterInput) => graphqlClient.request(REGISTER, { data }),
    onSuccess: () => toast.success("Conta criada com sucesso"),
    onError: notifyError,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) =>
      graphqlClient.request(UPDATE_PROFILE, { data }),
    onSuccess: ({ updateProfile }) => {
      queryClient.setQueryData(queryKeys.me, updateProfile);
      toast.success("Perfil atualizado");
    },
    onError: notifyError,
  });
}
