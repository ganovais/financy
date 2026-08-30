import * as React from "react";
import { Plus, Search, SquarePen, Trash } from "lucide-react";

import { CategoryIconBox } from "@/components/category-icon";
import { TransactionDialog } from "@/components/transaction-dialog";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import {
  Field,
  FieldLabel,
  Input,
  InputAdornment,
  InputRoot,
} from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tag } from "@/components/ui/tag";
import { TransactionTypeIndicator } from "@/components/ui/transaction-type";
import {
  useCategoryById,
  useFinance,
  useFinanceDispatch,
} from "@/lib/finance-context";
import {
  formatMonthLabel,
  formatShortDate,
  formatSignedCurrency,
  toMonthKey,
} from "@/lib/format";
import type { Category, Transaction } from "@/lib/types";

const PAGE_SIZE = 10;

const headerCellClassName =
  "text-xs leading-4 font-medium tracking-wider text-gray-500 uppercase";

const TransactionRow = React.memo(function TransactionRow({
  transaction,
  category,
  onEdit,
  onDelete,
}: {
  transaction: Transaction;
  category?: Category;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="flex items-center border-b border-border">
      <div className="flex h-[72px] min-w-0 flex-1 items-center gap-4 px-6">
        {category && <CategoryIconBox icon={category.icon} color={category.color} />}
        <p className="truncate text-base font-medium text-gray-800">
          {transaction.description}
        </p>
      </div>
      <div className="flex h-[72px] w-[112px] items-center justify-center px-6">
        <span className="text-sm whitespace-nowrap text-gray-600">
          {formatShortDate(transaction.date)}
        </span>
      </div>
      <div className="flex h-[72px] w-[200px] items-center justify-center px-6">
        {category && <Tag color={category.color}>{category.name}</Tag>}
      </div>
      <div className="flex h-[72px] w-[136px] items-center justify-center px-6">
        <TransactionTypeIndicator type={transaction.type} />
      </div>
      <div className="flex h-[72px] w-[200px] items-center justify-end px-6">
        <span className="text-sm font-semibold whitespace-nowrap text-gray-800">
          {formatSignedCurrency(transaction.amountInCents, transaction.type)}
        </span>
      </div>
      <div className="flex h-[72px] w-[120px] items-center justify-center gap-2 px-6">
        <IconButton
          variant="danger"
          aria-label={`Excluir ${transaction.description}`}
          onClick={() => onDelete(transaction.id)}
        >
          <Trash aria-hidden />
        </IconButton>
        <IconButton
          aria-label={`Editar ${transaction.description}`}
          onClick={() => onEdit(transaction)}
        >
          <SquarePen aria-hidden />
        </IconButton>
      </div>
    </li>
  );
});

export default function TransactionsPage() {
  const { transactions, categories } = useFinance();
  const dispatch = useFinanceDispatch();
  const getCategoryById = useCategoryById();

  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [monthFilter, setMonthFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] =
    React.useState<Transaction | null>(null);

  const monthOptions = React.useMemo(() => {
    const months = new Set(transactions.map((transaction) => toMonthKey(transaction.date)));
    return [...months].sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const filteredTransactions = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      if (query && !transaction.description.toLowerCase().includes(query)) {
        return false;
      }
      if (typeFilter !== "all" && transaction.type !== typeFilter) return false;
      if (categoryFilter !== "all" && transaction.categoryId !== categoryFilter) {
        return false;
      }
      if (monthFilter !== "all" && toMonthKey(transaction.date) !== monthFilter) {
        return false;
      }
      return true;
    });
  }, [transactions, search, typeFilter, categoryFilter, monthFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageTransactions = filteredTransactions.slice(
    pageStart,
    pageStart + PAGE_SIZE,
  );

  const handleEdit = React.useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  }, []);

  const handleDelete = React.useCallback(
    (id: string) => {
      dispatch({ type: "transaction/removed", payload: { id } });
    },
    [dispatch],
  );

  function handleCreate() {
    setEditingTransaction(null);
    setDialogOpen(true);
  }

  function updateFilter(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setPage(1);
    };
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <p className="text-base text-gray-600">
            Gerencie todas as suas transações financeiras
          </p>
        </div>
        <Button size="sm" onClick={handleCreate}>
          <Plus aria-hidden />
          Nova transação
        </Button>
      </header>
      <section className="flex items-start gap-4 rounded-xl border border-border bg-white p-6">
        <Field>
          <FieldLabel htmlFor="transaction-search">Buscar</FieldLabel>
          <InputRoot>
            <InputAdornment>
              <Search aria-hidden />
            </InputAdornment>
            <Input
              id="transaction-search"
              type="search"
              placeholder="Buscar por descrição"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </InputRoot>
        </Field>
        <Field>
          <FieldLabel htmlFor="transaction-type-filter">Tipo</FieldLabel>
          <Select value={typeFilter} onValueChange={updateFilter(setTypeFilter)}>
            <SelectTrigger id="transaction-type-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="income">Entrada</SelectItem>
              <SelectItem value="expense">Saída</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="transaction-category-filter">Categoria</FieldLabel>
          <Select
            value={categoryFilter}
            onValueChange={updateFilter(setCategoryFilter)}
          >
            <SelectTrigger id="transaction-category-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="transaction-month-filter">Período</FieldLabel>
          <Select value={monthFilter} onValueChange={updateFilter(setMonthFilter)}>
            <SelectTrigger id="transaction-month-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os períodos</SelectItem>
              {monthOptions.map((month) => (
                <SelectItem key={month} value={month}>
                  {formatMonthLabel(month)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </section>
      <section className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="flex items-center border-b border-border">
          <div className="flex-1 px-6 py-5">
            <span className={headerCellClassName}>Descrição</span>
          </div>
          <div className="w-[112px] px-6 py-5 text-center">
            <span className={headerCellClassName}>Data</span>
          </div>
          <div className="w-[200px] px-6 py-5 text-center">
            <span className={headerCellClassName}>Categoria</span>
          </div>
          <div className="w-[136px] px-6 py-5 text-center">
            <span className={headerCellClassName}>Tipo</span>
          </div>
          <div className="w-[200px] px-6 py-5 text-right">
            <span className={headerCellClassName}>Valor</span>
          </div>
          <div className="w-[120px] px-6 py-5 text-right">
            <span className={headerCellClassName}>Ações</span>
          </div>
        </div>
        {pageTransactions.length > 0 ? (
          <ul>
            {pageTransactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                category={getCategoryById(transaction.categoryId)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        ) : (
          <p className="border-b border-border px-6 py-10 text-center text-sm text-gray-500">
            Nenhuma transação encontrada
          </p>
        )}
        <footer className="flex items-center justify-between px-6 py-5">
          <p className="text-sm text-gray-700">
            <span className="font-medium">
              {filteredTransactions.length === 0 ? 0 : pageStart + 1}
            </span>{" "}
            a{" "}
            <span className="font-medium">
              {Math.min(pageStart + PAGE_SIZE, filteredTransactions.length)}
            </span>{" "}
            | <span className="font-medium">{filteredTransactions.length}</span>{" "}
            resultados
          </p>
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </footer>
      </section>
      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editingTransaction}
      />
    </div>
  );
}
