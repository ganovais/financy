import * as React from "react";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import type { CategoryInput } from "@/gql/graphql";
import { graphqlClient } from "@/lib/graphql/client";
import { getErrorMessage } from "@/lib/graphql/errors";
import {
  CATEGORIES,
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "@/lib/graphql/operations";
import { invalidateLedger, queryKeys } from "@/lib/query-client";
import type { Category } from "@/lib/types";

const EMPTY: Category[] = [];

const notifyError = (error: unknown) => toast.error(getErrorMessage(error));

export const categoriesQuery = queryOptions({
  queryKey: queryKeys.categories,
  queryFn: async () => {
    const { categories } = await graphqlClient.request(CATEGORIES);
    return categories as Category[];
  },
});

export function useCategories() {
  const query = useQuery(categoriesQuery);
  return { ...query, categories: query.data ?? EMPTY };
}

export function useCategoryById() {
  const { categories } = useCategories();

  return React.useMemo(() => {
    const map = new Map(categories.map((category) => [category.id, category]));
    return (id: string) => map.get(id);
  }, [categories]);
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryInput) =>
      graphqlClient.request(CREATE_CATEGORY, { data }),
    onSuccess: () => {
      toast.success("Categoria criada");
      return invalidateLedger(queryClient);
    },
    onError: notifyError,
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryInput }) =>
      graphqlClient.request(UPDATE_CATEGORY, { id, data }),
    onSuccess: () => {
      toast.success("Categoria atualizada");
      return invalidateLedger(queryClient);
    },
    onError: notifyError,
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => graphqlClient.request(DELETE_CATEGORY, { id }),
    onSuccess: () => {
      toast.success("Categoria excluída");
      return invalidateLedger(queryClient);
    },
    onError: notifyError,
  });
}
