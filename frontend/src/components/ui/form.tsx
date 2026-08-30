import * as React from "react"
import { Slot } from "radix-ui"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { Field, FieldHelper, FieldLabel } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const Form = FormProvider

interface FormFieldContextValue {
  name: string
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  const contextValue = React.useMemo(
    () => ({ name: props.name }),
    [props.name]
  )

  return (
    <FormFieldContext.Provider value={contextValue}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  if (!fieldContext) {
    throw new Error("useFormField must be used within FormField")
  }

  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)
  const { name } = fieldContext

  return {
    name,
    formItemId: `${name}-form-item`,
    formMessageId: `${name}-form-item-message`,
    ...fieldState,
  }
}

function FormItem({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { invalid } = useFormField()

  return <Field data-slot="form-item" invalid={invalid} className={className} {...props} />
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<"label">) {
  const { formItemId } = useFormField()

  return (
    <FieldLabel
      data-slot="form-label"
      htmlFor={formItemId}
      className={className}
      {...props}
    />
  )
}

function FormControl(props: React.ComponentProps<typeof Slot.Root>) {
  const { error, formItemId, formMessageId } = useFormField()

  return (
    <Slot.Root
      data-slot="form-control"
      id={formItemId}
      aria-describedby={error ? formMessageId : undefined}
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error.message ?? "") : children

  if (!body) return null

  return (
    <FieldHelper
      data-slot="form-message"
      id={formMessageId}
      className={cn(className)}
      {...props}
    >
      {body}
    </FieldHelper>
  )
}

export { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField }
