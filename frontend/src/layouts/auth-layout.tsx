import { Outlet } from "react-router";

import { Logo } from "@/components/logo";

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col items-center gap-8 p-12">
      <Logo />
      <main className="flex w-full max-w-md flex-col gap-8 rounded-xl border border-border bg-white p-8">
        <Outlet />
      </main>
    </div>
  );
}
