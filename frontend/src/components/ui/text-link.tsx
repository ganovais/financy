import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

function TextLink({
  className,
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="text-link"
      type={asChild ? type : (type ?? "button")}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center gap-1 text-sm font-medium whitespace-nowrap text-brand underline-offset-4 outline-none hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:size-5 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

export { TextLink }
