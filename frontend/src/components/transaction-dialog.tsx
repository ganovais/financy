import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputRoot } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinance, useFinanceDispatch } from "@/lib/finance-context";
import { formatCurrency, parseCurrencyInput } from "@/lib/format";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  description: z.string().trim().min(3, "Informe uma descrição"),
  date: z.string().min(1, "Informe uma data"),
  amount: z
    .string()
    .refine((value) => {
      const cents = parseCurrencyInput(value);
      return cents !== null && cents > 0;
    }, "Informe um valor válido"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
}

function toFormValues(transaction?: Transaction | null): TransactionFormValues {
  if (!transaction) {
    return {
      type: "expense",
      description: "",
      date: "",
      amount: "",
      categoryId: "",
    };
  }

  return {
    type: transaction.type,
    description: transaction.description,
    date: transaction.date,
    amount: formatCurrency(transaction.amountInCents).replace("R$", "").trim(),
    categoryId: transaction.categoryId,
  };
}

const typeOptions = [
  {
    value: "expense",
    label: "Despesa",
    icon: CircleArrowDown,
    selectedClassName: "border-red-base bg-gray-100",
    selectedIconClassName: "text-red-base",
  },
  {
    value: "income",
    label: "Receita",
    icon: CircleArrowUp,
    selectedClassName: "border-green-base bg-gray-100",
    selectedIconClassName: "text-green-base",
  },
] as const;

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
}: TransactionDialogProps) {
  const { categories } = useFinance();
  const dispatch = useFinanceDispatch();
  const isEditing = !!transaction;

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: toFormValues(transaction),
  });

  React.useEffect(() => {
    if (open) form.reset(toFormValues(transaction));
  }, [open, transaction, form]);

  function handleSave(values: TransactionFormValues) {
    const payload = {
      description: values.description.trim(),
      date: values.date,
      amountInCents: parseCurrencyInput(values.amount) ?? 0,
      type: values.type,
      categoryId: values.categoryId,
    };

    if (transaction) {
      dispatch({
        type: "transaction/updated",
        payload: { ...payload, id: transaction.id },
      });
    } else {
      dispatch({ type: "transaction/added", payload });
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da transação"
              : "Registre sua despesa ou receita"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSave)}
            noValidate
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <div
                  role="radiogroup"
                  aria-label="Tipo de transação"
                  className="flex rounded-xl border border-border p-2"
                >
                  {typeOptions.map((option) => {
                    const isSelected = field.value === option.value;
                    const Icon = option.icon;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => field.onChange(option.value)}
                        className={cn(
                          "flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-lg border border-transparent px-3 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                          isSelected && option.selectedClassName,
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-4",
                            isSelected
                              ? option.selectedIconClassName
                              : "text-gray-400",
                          )}
                          aria-hidden
                        />
                        <span
                          className={cn(
                            "text-base leading-[18px]",
                            isSelected
                              ? "font-medium text-gray-800"
                              : "text-gray-600",
                          )}
                        >
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            />
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <InputRoot>
                      <FormControl>
                        <Input
                          placeholder="Ex. Almoço no restaurante"
                          {...field}
                        />
                      </FormControl>
                    </InputRoot>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-start gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <InputRoot>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </InputRoot>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <InputRoot>
                        <span className="shrink-0 text-base text-gray-800">
                          R$
                        </span>
                        <FormControl>
                          <Input
                            inputMode="decimal"
                            placeholder="0,00"
                            {...field}
                          />
                        </FormControl>
                      </InputRoot>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
