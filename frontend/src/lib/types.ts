export const CATEGORY_COLORS = [
  "green",
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
] as const;

export type CategoryColor = (typeof CATEGORY_COLORS)[number];

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

export type CategoryIcon = (typeof CATEGORY_ICONS)[number];

export interface Category {
  id: string;
  name: string;
  description: string;
  color: CategoryColor;
  icon: CategoryIcon;
  transactionCount: number;
}

export const TRANSACTION_TYPES = ["income", "expense"] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export interface Transaction {
  id: string;
  description: string;
  date: string;
  amountInCents: number;
  type: TransactionType;
  categoryId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
