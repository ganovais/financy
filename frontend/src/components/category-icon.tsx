import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import type { CategoryColor, CategoryIcon } from "@/lib/types";
import { cn } from "@/lib/utils";

export const categoryIconMap: Record<CategoryIcon, LucideIcon> = {
  "briefcase-business": BriefcaseBusiness,
  "car-front": CarFront,
  "heart-pulse": HeartPulse,
  "piggy-bank": PiggyBank,
  "shopping-cart": ShoppingCart,
  ticket: Ticket,
  "tool-case": ToolCase,
  utensils: Utensils,
  "paw-print": PawPrint,
  house: House,
  gift: Gift,
  dumbbell: Dumbbell,
  "book-open": BookOpen,
  "baggage-claim": BaggageClaim,
  mailbox: Mailbox,
  "receipt-text": ReceiptText,
};

const colorStyles: Record<CategoryColor, { box: string; icon: string }> = {
  green: { box: "bg-green-light", icon: "text-green-base" },
  blue: { box: "bg-blue-light", icon: "text-blue-base" },
  purple: { box: "bg-purple-light", icon: "text-purple-base" },
  pink: { box: "bg-pink-light", icon: "text-pink-base" },
  red: { box: "bg-red-light", icon: "text-red-base" },
  orange: { box: "bg-orange-light", icon: "text-orange-base" },
  yellow: { box: "bg-yellow-light", icon: "text-yellow-base" },
};

interface CategoryIconBoxProps {
  icon: CategoryIcon;
  color: CategoryColor;
  className?: string;
}

export function CategoryIconBox({ icon, color, className }: CategoryIconBoxProps) {
  const Icon = categoryIconMap[icon];
  const styles = colorStyles[color];

  return (
    <span
      data-slot="category-icon-box"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg",
        styles.box,
        className,
      )}
    >
      <Icon className={cn("size-4", styles.icon)} aria-hidden />
    </span>
  );
}
