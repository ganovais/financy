import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import type { TransactionInput } from "@/gql/graphql";
import { graphqlClient } from "@/lib/graphql/client";
import { getErrorMessage } from "@/lib/graphql/errors";
import {
  CREATE_TRANSACTION,
  DELETE_TRANSACTION,
  TRANSACTIONS,
  UPDATE_TRANSACTION,
} from "@/lib/graphql/operations";
import { invalidateLedger, queryKeys } from "@/lib/query-client";
import type { Transaction } from "@/lib/types";

const EMPTY: Transaction[] = [];

const notifyError = (error: unknown) => toast.error(getErrorMessage(error));

export const transactionsQuery = queryOptions({
  queryKey: queryKeys.transactions,
  queryFn: async () => {
    const { transactions } = await graphqlClient.request(TRANSACTIONS);
    return transactions as Transaction[];
  },
});

export function useTransactions() {
  const query = useQuery(transactionsQuery);
  return { ...query, transactions: query.data ?? EMPTY };
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransactionInput) =>
      graphqlClient.request(CREATE_TRANSACTION, { data }),
    onSuccess: () => {
      toast.success("Transação criada");
      return invalidateLedger(queryClient);
    },
    onError: notifyError,
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TransactionInput }) =>
      graphqlClient.request(UPDATE_TRANSACTION, { id, data }),
    onSuccess: () => {
      toast.success("Transação atualizada");
      return invalidateLedger(queryClient);
    },
    onError: notifyError,
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => graphqlClient.request(DELETE_TRANSACTION, { id }),
    onSuccess: () => {
      toast.success("Transação excluída");
      return invalidateLedger(queryClient);
    },
    onError: notifyError,
  });
}
