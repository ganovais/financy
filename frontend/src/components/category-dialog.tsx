import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { categoryIconMap } from "@/components/category-icon";
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
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  type Category,
  type CategoryColor,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().trim().min(2, "Informe um título"),
  description: z.string().trim().max(100, "A descrição deve ser mais curta"),
  icon: z.enum(CATEGORY_ICONS),
  color: z.enum(CATEGORY_COLORS),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
}

function toFormValues(category?: Category | null): CategoryFormValues {
  if (!category) {
    return { name: "", description: "", icon: "briefcase-business", color: "green" };
  }

  return {
    name: category.name,
    description: category.description,
    icon: category.icon,
    color: category.color,
  };
}

const colorSwatchClasses: Record<CategoryColor, string> = {
  green: "bg-green-base",
  blue: "bg-blue-base",
  purple: "bg-purple-base",
  pink: "bg-pink-base",
  red: "bg-red-base",
  orange: "bg-orange-base",
  yellow: "bg-yellow-base",
};

const colorLabels: Record<CategoryColor, string> = {
  green: "Verde",
  blue: "Azul",
  purple: "Roxo",
  pink: "Rosa",
  red: "Vermelho",
  orange: "Laranja",
  yellow: "Amarelo",
};

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isEditing = !!category;
  const isPending = createCategory.isPending || updateCategory.isPending;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: toFormValues(category),
  });

  React.useEffect(() => {
    if (open) form.reset(toFormValues(category));
  }, [open, category, form]);

  function handleSave(values: CategoryFormValues) {
    const options = { onSuccess: () => onOpenChange(false) };

    if (category) {
      updateCategory.mutate({ id: category.id, data: values }, options);
    } else {
      createCategory.mutate(values, options);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da categoria"
              : "Organize suas transações com categorias"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSave)}
            noValidate
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <InputRoot>
                      <FormControl>
                        <Input placeholder="Ex. Alimentação" {...field} />
                      </FormControl>
                    </InputRoot>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <InputRoot>
                      <FormControl>
                        <Input placeholder="Descrição da categoria" {...field} />
                      </FormControl>
                    </InputRoot>
                    <FormMessage>Opcional</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id="category-icon-label">Ícone</FormLabel>
                    <div
                      role="radiogroup"
                      aria-labelledby="category-icon-label"
                      className="flex flex-wrap gap-2"
                    >
                      {CATEGORY_ICONS.map((icon) => {
                        const Icon = categoryIconMap[icon];
                        const isSelected = field.value === icon;

                        return (
                          <button
                            key={icon}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            aria-label={icon}
                            onClick={() => field.onChange(icon)}
                            className={cn(
                              "flex size-[42px] cursor-pointer items-center justify-center rounded-lg border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                              isSelected
                                ? "border-brand bg-gray-100 text-gray-600"
                                : "border-input text-gray-500 hover:bg-gray-100",
                            )}
                          >
                            <Icon className="size-5" aria-hidden />
                          </button>
                        );
                      })}
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id="category-color-label">Cor</FormLabel>
                    <div
                      role="radiogroup"
                      aria-labelledby="category-color-label"
                      className="flex gap-2"
                    >
                      {CATEGORY_COLORS.map((color) => {
                        const isSelected = field.value === color;

                        return (
                          <button
                            key={color}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            aria-label={colorLabels[color]}
                            onClick={() => field.onChange(color)}
                            className={cn(
                              "flex h-8 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg border p-[5px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                              isSelected
                                ? "border-brand bg-gray-100"
                                : "border-input hover:bg-gray-100",
                            )}
                          >
                            <span
                              className={cn(
                                "h-5 w-full rounded-sm",
                                colorSwatchClasses[color],
                              )}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isPending}>
              Salvar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
