import { z } from "zod";

import { badInput } from "./errors.ts";

export const CATEGORY_COLORS = [
  "green",
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
] as const;

export const CATEGORY_ICONS = [
  "briefcase-business",
  "car-front",
  "heart-pulse",
  "piggy-bank",
  "shopping-cart",
  "ticket",
  "tool-case",
  "utensils",
  "paw-print",
  "house",
  "gift",
  "dumbbell",
  "book-open",
  "baggage-claim",
  "mailbox",
  "receipt-text",
] as const;

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo").max(100),
  email: z.email("Informe um e-mail válido").toLowerCase(),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .max(128),
});

export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido").toLowerCase(),
  password: z.string().min(1, "Informe a senha"),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo").max(100),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Informe um título").max(50),
  description: z
    .string()
    .trim()
    .max(100, "A descrição deve ser mais curta")
    .default(""),
  color: z.enum(CATEGORY_COLORS, "Cor inválida"),
  icon: z.enum(CATEGORY_ICONS, "Ícone inválido"),
});

export const transactionSchema = z.object({
  description: z.string().trim().min(3, "Informe uma descrição").max(100),
  date: z.iso.date("Informe uma data válida"),
  amountInCents: z
    .number()
    .int("Informe um valor válido")
    .positive("Informe um valor válido"),
  type: z.enum(["income", "expense"], "Tipo inválido"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
});

export function parseInput<T extends z.ZodType>(
  schema: T,
  data: unknown,
): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw badInput(result.error.issues[0]?.message ?? "Dados inválidos");
  }
  return result.data;
}
