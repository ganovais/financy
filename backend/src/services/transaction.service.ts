import { notFound } from "../lib/errors.ts";
import { prisma } from "../lib/prisma.ts";
import { serializeTransaction } from "../lib/serialize.ts";
import { parseInput, transactionSchema } from "../lib/validation.ts";

const withCategory = {
  category: { include: { _count: { select: { transactions: true } } } },
} as const;

async function assertOwnCategory(userId: string, categoryId: string) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
    select: { id: true },
  });
  if (!category) throw notFound("Categoria não encontrada");
}

export async function listTransactions(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    include: withCategory,
  });
  return transactions.map(serializeTransaction);
}

export async function createTransaction(userId: string, data: unknown) {
  const input = parseInput(transactionSchema, data);
  await assertOwnCategory(userId, input.categoryId);

  const transaction = await prisma.transaction.create({
    data: { ...input, date: new Date(input.date), userId },
    include: withCategory,
  });
  return serializeTransaction(transaction);
}

export async function updateTransaction(
  userId: string,
  id: string,
  data: unknown,
) {
  const input = parseInput(transactionSchema, data);
  await assertOwnCategory(userId, input.categoryId);

  const { count } = await prisma.transaction.updateMany({
    where: { id, userId },
    data: { ...input, date: new Date(input.date) },
  });
  if (count === 0) throw notFound("Transação não encontrada");

  const transaction = await prisma.transaction.findUniqueOrThrow({
    where: { id },
    include: withCategory,
  });
  return serializeTransaction(transaction);
}

export async function deleteTransaction(userId: string, id: string) {
  const { count } = await prisma.transaction.deleteMany({
    where: { id, userId },
  });
  if (count === 0) throw notFound("Transação não encontrada");
  return id;
}
