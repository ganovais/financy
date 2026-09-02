import * as React from "react";
import {
  ArrowUpDown,
  Plus,
  SquarePen,
  Tag as TagIcon,
  Trash,
  type LucideIcon,
} from "lucide-react";

import { CategoryDialog } from "@/components/category-dialog";
import { CategoryIconBox, categoryIconMap } from "@/components/category-icon";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Tag } from "@/components/ui/tag";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import type { Category } from "@/lib/types";

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <article className="flex min-w-0 flex-1 items-start gap-4 rounded-xl border border-border bg-white p-6">
      <span className="flex size-8 shrink-0 items-center justify-center">
        <Icon className="size-6 text-gray-700" aria-hidden />
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <p className="truncate text-[1.75rem] leading-8 font-bold text-gray-800">
          {value}
        </p>
        <p className="text-xs leading-4 font-medium tracking-wider text-gray-500 uppercase">
          {label}
        </p>
      </div>
    </article>
  );
}

const CategoryCard = React.memo(function CategoryCard({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}) {
  const { transactionCount } = category;

  return (
    <article className="flex flex-col gap-5 rounded-xl border border-border bg-white p-6">
      <header className="flex items-start justify-between gap-2">
        <CategoryIconBox icon={category.icon} color={category.color} />
        <div className="flex items-center gap-2">
          <IconButton
            variant="danger"
            aria-label={`Excluir categoria ${category.name}`}
            onClick={() => onDelete(category.id)}
          >
            <Trash aria-hidden />
          </IconButton>
          <IconButton
            aria-label={`Editar categoria ${category.name}`}
            onClick={() => onEdit(category)}
          >
            <SquarePen aria-hidden />
          </IconButton>
        </div>
      </header>
      <div className="flex flex-col gap-1">
        <h2 className="truncate text-base font-semibold text-gray-800">
          {category.name}
        </h2>
        <p className="line-clamp-2 h-10 text-sm text-gray-600">
          {category.description}
        </p>
      </div>
      <footer className="flex items-center justify-between gap-2">
        <Tag color={category.color}>{category.name}</Tag>
        <span className="text-sm text-gray-600">
          {transactionCount} {transactionCount === 1 ? "item" : "itens"}
        </span>
      </footer>
    </article>
  );
});

export default function CategoriesPage() {
  const { categories, isPending } = useCategories();
  const { mutate: deleteCategory } = useDeleteCategory();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);

  const sortedCategories = React.useMemo(
    () =>
      [...categories].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    [categories],
  );

  const totalTransactions = React.useMemo(
    () => categories.reduce((total, category) => total + category.transactionCount, 0),
    [categories],
  );

  const mostUsedCategory = React.useMemo(() => {
    let best: Category | null = null;

    for (const category of sortedCategories) {
      if (!best || category.transactionCount > best.transactionCount) {
        best = category;
      }
    }

    return best;
  }, [sortedCategories]);

  const handleEdit = React.useCallback((category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  }, []);

  const handleDelete = React.useCallback(
    (id: string) => deleteCategory(id),
    [deleteCategory],
  );

  function handleCreate() {
    setEditingCategory(null);
    setDialogOpen(true);
  }

  const MostUsedIcon = mostUsedCategory
    ? categoryIconMap[mostUsedCategory.icon]
    : TagIcon;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-base text-gray-600">
            Organize suas transações por categorias
          </p>
        </div>
        <Button size="sm" onClick={handleCreate}>
          <Plus aria-hidden />
          Nova categoria
        </Button>
      </header>
      <section className="flex gap-6">
        <StatCard
          icon={TagIcon}
          value={isPending ? "—" : String(categories.length)}
          label="total de categorias"
        />
        <StatCard
          icon={ArrowUpDown}
          value={isPending ? "—" : String(totalTransactions)}
          label="total de transações"
        />
        <StatCard
          icon={MostUsedIcon}
          value={mostUsedCategory?.name ?? "—"}
          label="categoria mais utilizada"
        />
      </section>
      {!isPending && sortedCategories.length === 0 ? (
        <p className="rounded-xl border border-border bg-white px-6 py-10 text-center text-sm text-gray-500">
          Nenhuma categoria cadastrada
        </p>
      ) : (
        <section className="grid grid-cols-4 gap-4">
          {sortedCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </section>
      )}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
      />
    </div>
  );
}
