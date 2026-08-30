import { CircleArrowDown, CircleArrowUp } from "lucide-react"

import type { TransactionType } from "@/lib/types"
import { cn } from "@/lib/utils"

const typeConfig = {
  income: {
    label: "Entrada",
    icon: CircleArrowUp,
    iconClassName: "text-green-base",
    textClassName: "text-green-dark",
  },
  expense: {
    label: "Saída",
    icon: CircleArrowDown,
    iconClassName: "text-red-base",
    textClassName: "text-red-dark",
  },
} as const

function TransactionTypeIndicator({
  type,
  className,
}: {
  type: TransactionType
  className?: string
}) {
  const { label, icon: Icon, iconClassName, textClassName } = typeConfig[type]

  return (
    <span
      data-slot="transaction-type"
      className={cn("inline-flex items-center gap-2", className)}
    >
      <Icon className={cn("size-4", iconClassName)} aria-hidden />
      <span className={cn("text-sm font-medium", textClassName)}>{label}</span>
    </span>
  )
}

export { TransactionTypeIndicator }
