import * as auth from "../services/auth.service.ts";
import * as categories from "../services/category.service.ts";
import * as transactions from "../services/transaction.service.ts";
import * as users from "../services/user.service.ts";
import { requireAuth, type Context } from "./context.ts";

type IdArgs = { id: string };
type DataArgs = { data: unknown };
type IdDataArgs = IdArgs & DataArgs;

export const resolvers = {
  Query: {
    me: (_: unknown, __: unknown, context: Context) =>
      users.me(requireAuth(context)),
    categories: (_: unknown, __: unknown, context: Context) =>
      categories.listCategories(requireAuth(context)),
    transactions: (_: unknown, __: unknown, context: Context) =>
      transactions.listTransactions(requireAuth(context)),
  },
  Mutation: {
    register: (_: unknown, args: DataArgs) => auth.register(args.data),
    login: (_: unknown, args: DataArgs) => auth.login(args.data),
    updateProfile: (_: unknown, args: DataArgs, context: Context) =>
      users.updateProfile(requireAuth(context), args.data),
    createCategory: (_: unknown, args: DataArgs, context: Context) =>
      categories.createCategory(requireAuth(context), args.data),
    updateCategory: (_: unknown, args: IdDataArgs, context: Context) =>
      categories.updateCategory(requireAuth(context), args.id, args.data),
    deleteCategory: (_: unknown, args: IdArgs, context: Context) =>
      categories.deleteCategory(requireAuth(context), args.id),
    createTransaction: (_: unknown, args: DataArgs, context: Context) =>
      transactions.createTransaction(requireAuth(context), args.data),
    updateTransaction: (_: unknown, args: IdDataArgs, context: Context) =>
      transactions.updateTransaction(requireAuth(context), args.id, args.data),
    deleteTransaction: (_: unknown, args: IdArgs, context: Context) =>
      transactions.deleteTransaction(requireAuth(context), args.id),
  },
};
