import * as React from "react"

import { cn } from "@/lib/utils"

function Field({
  className,
  invalid = false,
  ...props
}: React.ComponentProps<"div"> & { invalid?: boolean }) {
  return (
    <div
      data-slot="field"
      data-invalid={invalid || undefined}
      className={cn("group/field flex w-full flex-col gap-2", className)}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        "text-sm leading-5 font-medium text-gray-700 transition-colors group-focus-within/field:text-brand group-data-[invalid]/field:text-danger",
        className
      )}
      {...props}
    />
  )
}

function FieldHelper({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-helper"
      className={cn("text-xs leading-4 text-gray-500", className)}
      {...props}
    />
  )
}

function InputRoot({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-root"
      className={cn(
        "flex h-[50px] w-full items-center gap-3 rounded-lg border border-input bg-white px-[13px] transition-opacity has-[input:disabled]:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function InputAdornment({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-adornment"
      className={cn(
        "flex shrink-0 items-center text-gray-400 transition-colors group-focus-within/field:text-brand group-data-[invalid]/field:text-danger [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      className={cn(
        "h-full w-full min-w-0 flex-1 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export { Field, FieldHelper, FieldLabel, Input, InputAdornment, InputRoot }
