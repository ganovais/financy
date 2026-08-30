import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const iconButtonVariants = cva(
  "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-input bg-white transition-colors outline-none select-none hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        outline: "text-gray-700",
        danger: "text-danger",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
)

function IconButton({
  className,
  variant,
  type,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof iconButtonVariants>) {
  return (
    <button
      data-slot="icon-button"
      type={type ?? "button"}
      className={cn(iconButtonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { IconButton, iconButtonVariants }
