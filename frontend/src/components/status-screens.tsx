import { RotateCw } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export function SplashScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center" aria-busy>
      <Logo className="animate-pulse" />
    </div>
  );
}

export function ConnectionErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 p-12 text-center">
      <Logo />
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-gray-800">
          Não foi possível conectar
        </h1>
        <p className="text-base text-gray-600">
          Verifique se o servidor está no ar e tente novamente
        </p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        <RotateCw aria-hidden />
        Tentar novamente
      </Button>
    </div>
  );
}
