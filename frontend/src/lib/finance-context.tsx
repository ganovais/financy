import * as React from "react";

import { mockCategories, mockTransactions } from "./mock-data";
import type { Category, Transaction } from "./types";

interface FinanceState {
  categories: Category[];
  transactions: Transaction[];
}

type FinanceAction =
  | { type: "transaction/added"; payload: Omit<Transaction, "id"> }
  | { type: "transaction/updated"; payload: Transaction }
  | { type: "transaction/removed"; payload: { id: string } }
  | { type: "category/added"; payload: Omit<Category, "id"> }
  | { type: "category/updated"; payload: Category }
  | { type: "category/removed"; payload: { id: string } };

const initialState: FinanceState = {
  categories: mockCategories,
  transactions: mockTransactions,
};

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function byDateDesc(a: Transaction, b: Transaction) {
  return b.date.localeCompare(a.date);
}

function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case "transaction/added":
      return {
        ...state,
        transactions: [
          { ...action.payload, id: createId("txn") },
          ...state.transactions,
        ].sort(byDateDesc),
      };
    case "transaction/updated":
      return {
        ...state,
        transactions: state.transactions
          .map((transaction) =>
            transaction.id === action.payload.id ? action.payload : transaction,
          )
          .sort(byDateDesc),
      };
    case "transaction/removed":
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload.id,
        ),
      };
    case "category/added":
      return {
        ...state,
        categories: [...state.categories, { ...action.payload, id: createId("cat") }],
      };
    case "category/updated":
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category,
        ),
      };
    case "category/removed":
      return {
        categories: state.categories.filter(
          (category) => category.id !== action.payload.id,
        ),
        transactions: state.transactions.filter(
          (transaction) => transaction.categoryId !== action.payload.id,
        ),
      };
  }
}

const FinanceStateContext = React.createContext<FinanceState | null>(null);
const FinanceDispatchContext =
  React.createContext<React.Dispatch<FinanceAction> | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(financeReducer, initialState);

  return (
    <FinanceStateContext.Provider value={state}>
      <FinanceDispatchContext.Provider value={dispatch}>
        {children}
      </FinanceDispatchContext.Provider>
    </FinanceStateContext.Provider>
  );
}

export function useFinance() {
  const state = React.useContext(FinanceStateContext);
  if (!state) throw new Error("useFinance must be used within FinanceProvider");
  return state;
}

export function useFinanceDispatch() {
  const dispatch = React.useContext(FinanceDispatchContext);
  if (!dispatch) {
    throw new Error("useFinanceDispatch must be used within FinanceProvider");
  }
  return dispatch;
}

export function useCategoryById() {
  const { categories } = useFinance();
  return React.useMemo(() => {
    const map = new Map(categories.map((category) => [category.id, category]));
    return (id: string) => map.get(id);
  }, [categories]);
}
