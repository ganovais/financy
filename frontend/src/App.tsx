import { Navigate, Route, Routes } from "react-router";

import { ConnectionErrorScreen, SplashScreen } from "@/components/status-screens";
import { AppLayout } from "@/layouts/app-layout";
import { AuthLayout } from "@/layouts/auth-layout";
import { useAuth } from "@/lib/auth-context";
import CategoriesPage from "@/pages/categorias";
import SignUpPage from "@/pages/cadastro";
import DashboardPage from "@/pages/dashboard";
import LoginPage from "@/pages/login";
import ProfilePage from "@/pages/perfil";
import TransactionsPage from "@/pages/transacoes";

function App() {
  const { status, retry } = useAuth();

  if (status === "loading") return <SplashScreen />;
  if (status === "error") return <ConnectionErrorScreen onRetry={retry} />;

  return (
    <Routes>
      {status === "authenticated" ? (
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="transacoes" element={<TransactionsPage />} />
          <Route path="categorias" element={<CategoriesPage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      ) : (
        <Route element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="cadastro" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
