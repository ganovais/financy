import type {
  Category,
  Transaction,
  User,
} from "../../generated/prisma/client.ts";

type CategoryWithCount = Category & { _count: { transactions: number } };
type TransactionWithCategory = Transaction & { category: CategoryWithCount };

export function serializeUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function serializeCategory(category: CategoryWithCount) {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    color: category.color,
    icon: category.icon,
    transactionCount: category._count.transactions,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export function serializeTransaction(transaction: TransactionWithCategory) {
  return {
    id: transaction.id,
    description: transaction.description,
    date: transaction.date.toISOString().slice(0, 10),
    amountInCents: transaction.amountInCents,
    type: transaction.type,
    categoryId: transaction.categoryId,
    category: serializeCategory(transaction.category),
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  };
}
