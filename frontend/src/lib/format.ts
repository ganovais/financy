const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

export function formatCurrency(cents: number) {
  return currencyFormatter.format(cents / 100);
}

export function formatSignedCurrency(cents: number, type: "income" | "expense") {
  const sign = type === "income" ? "+" : "-";
  return `${sign} ${formatCurrency(cents)}`;
}

export function formatShortDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year.slice(2)}`;
}

export function toMonthKey(isoDate: string) {
  return isoDate.slice(0, 7);
}

export function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-");
  return `${MONTH_NAMES[Number(month) - 1]} / ${year}`;
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

export function parseCurrencyInput(value: string) {
  const normalized = value
    .trim()
    .replace(/^R\$\s?/, "")
    .replaceAll(".", "")
    .replace(",", ".");
  const amount = Number(normalized);
  if (!Number.isFinite(amount)) return null;
  return Math.round(amount * 100);
}
