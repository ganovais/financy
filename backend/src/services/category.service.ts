import { notFound } from "../lib/errors.ts";
import { prisma } from "../lib/prisma.ts";
import { serializeCategory } from "../lib/serialize.ts";
import { categorySchema, parseInput } from "../lib/validation.ts";

const withCount = { _count: { select: { transactions: true } } } as const;

export async function listCategories(userId: string) {
  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: withCount,
  });
  return categories.map(serializeCategory);
}

export async function createCategory(userId: string, data: unknown) {
  const input = parseInput(categorySchema, data);

  const category = await prisma.category.create({
    data: { ...input, userId },
    include: withCount,
  });
  return serializeCategory(category);
}

export async function updateCategory(userId: string, id: string, data: unknown) {
  const input = parseInput(categorySchema, data);

  const { count } = await prisma.category.updateMany({
    where: { id, userId },
    data: input,
  });
  if (count === 0) throw notFound("Categoria não encontrada");

  const category = await prisma.category.findUniqueOrThrow({
    where: { id },
    include: withCount,
  });
  return serializeCategory(category);
}

export async function deleteCategory(userId: string, id: string) {
  const { count } = await prisma.category.deleteMany({ where: { id, userId } });
  if (count === 0) throw notFound("Categoria não encontrada");
  return id;
}
