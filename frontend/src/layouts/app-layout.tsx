import { Outlet } from "react-router";

import { Navbar } from "@/components/navbar";
import { FinanceProvider } from "@/lib/finance-context";

export function AppLayout() {
  return (
    <FinanceProvider>
      <Navbar />
      <main className="px-12 py-12">
        <div className="mx-auto w-full max-w-[1280px]">
          <Outlet />
        </div>
      </main>
    </FinanceProvider>
  );
}
