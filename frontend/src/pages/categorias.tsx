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
import { useFinance, useFinanceDispatch } from "@/lib/finance-context";
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
  itemCount,
  onEdit,
  onDelete,
}: {
  category: Category;
  itemCount: number;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}) {
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
          {itemCount} {itemCount === 1 ? "item" : "itens"}
        </span>
      </footer>
    </article>
  );
});

export default function CategoriesPage() {
  const { categories, transactions } = useFinance();
  const dispatch = useFinanceDispatch();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);

  const itemCountByCategory = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const transaction of transactions) {
      counts.set(
        transaction.categoryId,
        (counts.get(transaction.categoryId) ?? 0) + 1,
      );
    }
    return counts;
  }, [transactions]);

  const sortedCategories = React.useMemo(
    () =>
      [...categories].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    [categories],
  );

  const mostUsedCategory = React.useMemo(() => {
    let best: Category | null = null;
    let bestCount = -1;

    for (const category of sortedCategories) {
      const count = itemCountByCategory.get(category.id) ?? 0;
      if (count > bestCount) {
        best = category;
        bestCount = count;
      }
    }

    return best;
  }, [sortedCategories, itemCountByCategory]);

  const handleEdit = React.useCallback((category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  }, []);

  const handleDelete = React.useCallback(
    (id: string) => {
      dispatch({ type: "category/removed", payload: { id } });
    },
    [dispatch],
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
          value={String(categories.length)}
          label="total de categorias"
        />
        <StatCard
          icon={ArrowUpDown}
          value={String(transactions.length)}
          label="total de transações"
        />
        <StatCard
          icon={MostUsedIcon}
          value={mostUsedCategory?.name ?? "—"}
          label="categoria mais utilizada"
        />
      </section>
      <section className="grid grid-cols-4 gap-4">
        {sortedCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            itemCount={itemCountByCategory.get(category.id) ?? 0}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </section>
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
      />
    </div>
  );
}
