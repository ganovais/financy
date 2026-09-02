import { Link, useLocation } from "react-router";

import { Logo } from "@/components/logo";
import { useUser } from "@/lib/auth-context";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transacoes", label: "Transações" },
  { href: "/categorias", label: "Categorias" },
] as const;

export function Navbar() {
  const { pathname } = useLocation();
  const user = useUser();

  return (
    <header className="border-b border-border bg-white">
      <div className="px-12">
        <div className="relative mx-auto flex h-[68px] w-full max-w-[1280px] items-center justify-between">
          <Link
            to="/"
            aria-label="Ir para o dashboard"
            className="outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <Logo className="h-6" />
          </Link>
          <nav
            aria-label="Navegação principal"
            className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-5"
          >
            {navItems.map((item) => {
              const isActive =
                pathname === "/"
                  ? item.href === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "text-sm outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/50",
                    isActive
                      ? "font-semibold text-brand"
                      : "text-gray-600 transition-colors hover:text-gray-800",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link
            to="/perfil"
            aria-label="Ir para o perfil"
            className="flex size-9 items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-800 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
          >
            {getInitials(user.name)}
          </Link>
        </div>
      </div>
    </header>
  );
}
