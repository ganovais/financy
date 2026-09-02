import * as React from "react";
import {
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  Plus,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router";

import { CategoryIconBox } from "@/components/category-icon";
import { TransactionDialog } from "@/components/transaction-dialog";
import { Tag } from "@/components/ui/tag";
import { TextLink } from "@/components/ui/text-link";
import { useCategoryById } from "@/hooks/use-categories";
import { useTransactions } from "@/hooks/use-transactions";
import {
  formatCurrency,
  formatShortDate,
  formatSignedCurrency,
  toMonthKey,
} from "@/lib/format";
import type { Category, Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";

function SectionLabel({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "text-xs leading-4 font-medium tracking-wider text-gray-500 uppercase",
        className,
      )}
      {...props}
    />
  );
}

function SummaryCard({
  icon: Icon,
  iconClassName,
  label,
  value,
}: {
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  value: string;
}) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border bg-white p-6">
      <header className="flex items-center gap-3">
        <Icon className={cn("size-5", iconClassName)} aria-hidden />
        <SectionLabel>{label}</SectionLabel>
      </header>
      <p className="text-[1.75rem] leading-8 font-bold text-gray-800">{value}</p>
    </article>
  );
}

const RecentTransactionRow = React.memo(function RecentTransactionRow({
  transaction,
  category,
}: {
  transaction: Transaction;
  category?: Category;
}) {
  const isIncome = transaction.type === "income";

  return (
    <li className="flex items-center border-b border-border">
      <div className="flex h-20 min-w-0 flex-1 items-center gap-4 px-6">
        {category && <CategoryIconBox icon={category.icon} color={category.color} />}
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-base font-medium text-gray-800">
            {transaction.description}
          </p>
          <p className="text-sm text-gray-600">{formatShortDate(transaction.date)}</p>
        </div>
      </div>
      <div className="flex h-20 w-40 items-center justify-center px-6">
        {category && <Tag color={category.color}>{category.name}</Tag>}
      </div>
      <div className="flex h-20 w-40 items-center justify-end gap-2 px-6">
        <span className="text-sm font-semibold whitespace-nowrap text-gray-800">
          {formatSignedCurrency(transaction.amountInCents, transaction.type)}
        </span>
        {isIncome ? (
          <CircleArrowUp className="size-4 text-brand" aria-hidden />
        ) : (
          <CircleArrowDown className="size-4 text-red-base" aria-hidden />
        )}
      </div>
    </li>
  );
});

export default function DashboardPage() {
  const { transactions, isPending } = useTransactions();
  const getCategoryById = useCategoryById();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const summary = React.useMemo(() => {
    const currentMonth = transactions.reduce(
      (latest, transaction) => {
        const month = toMonthKey(transaction.date);
        return month > latest ? month : latest;
      },
      "",
    );

    let balance = 0;
    let monthIncome = 0;
    let monthExpense = 0;

    for (const transaction of transactions) {
      const signed =
        transaction.type === "income"
          ? transaction.amountInCents
          : -transaction.amountInCents;
      balance += signed;

      if (toMonthKey(transaction.date) === currentMonth) {
        if (transaction.type === "income") monthIncome += transaction.amountInCents;
        else monthExpense += transaction.amountInCents;
      }
    }

    return { balance, monthIncome, monthExpense };
  }, [transactions]);

  const recentTransactions = React.useMemo(
    () => transactions.slice(0, 5),
    [transactions],
  );

  const topExpenseCategories = React.useMemo(() => {
    const totals = new Map<string, { count: number; totalInCents: number }>();

    for (const transaction of transactions) {
      if (transaction.type !== "expense") continue;
      const entry = totals.get(transaction.categoryId) ?? {
        count: 0,
        totalInCents: 0,
      };
      entry.count += 1;
      entry.totalInCents += transaction.amountInCents;
      totals.set(transaction.categoryId, entry);
    }

    return [...totals.entries()]
      .map(([categoryId, entry]) => ({ category: getCategoryById(categoryId), ...entry }))
      .filter((entry) => !!entry.category)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [transactions, getCategoryById]);

  const summaryValue = (cents: number) => (isPending ? "—" : formatCurrency(cents));

  return (
    <div className="grid grid-cols-3 items-start gap-6">
      <SummaryCard
        icon={Wallet}
        iconClassName="text-purple-base"
        label="Saldo total"
        value={summaryValue(summary.balance)}
      />
      <SummaryCard
        icon={CircleArrowUp}
        iconClassName="text-brand"
        label="Receitas do mês"
        value={summaryValue(summary.monthIncome)}
      />
      <SummaryCard
        icon={CircleArrowDown}
        iconClassName="text-red-base"
        label="Despesas do mês"
        value={summaryValue(summary.monthExpense)}
      />
      <section className="col-span-2 overflow-hidden rounded-xl border border-border bg-white">
        <header className="flex items-center justify-between border-b border-border py-5 pr-3 pl-6">
          <SectionLabel>Transações recentes</SectionLabel>
          <TextLink asChild>
            <Link to="/transacoes">
              Ver todas
              <ChevronRight aria-hidden />
            </Link>
          </TextLink>
        </header>
        {!isPending && recentTransactions.length === 0 ? (
          <p className="border-b border-border px-6 py-10 text-center text-sm text-gray-500">
            Nenhuma transação registrada
          </p>
        ) : (
          <ul>
            {recentTransactions.map((transaction) => (
              <RecentTransactionRow
                key={transaction.id}
                transaction={transaction}
                category={getCategoryById(transaction.categoryId)}
              />
            ))}
          </ul>
        )}
        <footer className="flex items-center justify-center px-6 py-5">
          <TextLink onClick={() => setDialogOpen(true)}>
            <Plus aria-hidden />
            Nova transação
          </TextLink>
        </footer>
      </section>
      <section className="overflow-hidden rounded-xl border border-border bg-white">
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <SectionLabel>Categorias</SectionLabel>
          <TextLink asChild>
            <Link to="/categorias">
              Gerenciar
              <ChevronRight aria-hidden />
            </Link>
          </TextLink>
        </header>
        {!isPending && topExpenseCategories.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-gray-500">
            Nenhuma despesa registrada
          </p>
        ) : (
          <ul className="flex flex-col gap-5 p-6">
            {topExpenseCategories.map(({ category, count, totalInCents }) => (
              <li key={category!.id} className="flex items-center gap-1">
                <Tag color={category!.color}>{category!.name}</Tag>
                <span className="min-w-0 flex-1 text-right text-sm text-gray-600">
                  {count} {count === 1 ? "item" : "itens"}
                </span>
                <span className="w-[88px] text-right text-sm font-semibold text-gray-800">
                  {formatCurrency(totalInCents)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
