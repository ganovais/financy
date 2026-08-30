import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm leading-5 font-medium whitespace-nowrap",
  {
    variants: {
      color: {
        gray: "bg-gray-200 text-gray-700",
        blue: "bg-blue-light text-blue-dark",
        purple: "bg-purple-light text-purple-dark",
        pink: "bg-pink-light text-pink-dark",
        red: "bg-red-light text-red-dark",
        orange: "bg-orange-light text-orange-dark",
        yellow: "bg-yellow-light text-yellow-dark",
        green: "bg-green-light text-green-dark",
      },
    },
    defaultVariants: {
      color: "gray",
    },
  }
)

function Tag({
  className,
  color,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof tagVariants>) {
  return (
    <span
      data-slot="tag"
      className={cn(tagVariants({ color, className }))}
      {...props}
    />
  )
}

export { Tag, tagVariants }
