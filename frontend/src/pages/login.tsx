import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, UserRoundPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputAdornment, InputRoot } from "@/components/ui/input";
import { TextLink } from "@/components/ui/text-link";

const loginSchema = z.object({
  email: z.email("Informe um e-mail válido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  async function handleLogin() {
    await new Promise((resolve) => setTimeout(resolve, 600));
    navigate("/dashboard");
  }

  return (
    <>
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold text-gray-800">Fazer login</h1>
        <p className="text-base text-gray-600">Entre na sua conta para continuar</p>
      </header>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLogin)}
          noValidate
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <InputRoot>
                    <InputAdornment>
                      <Mail aria-hidden />
                    </InputAdornment>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="mail@exemplo.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                  </InputRoot>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Digite sua senha"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    Lembrar-me
                  </label>
                )}
              />
              <TextLink>Recuperar senha</TextLink>
            </div>
          </div>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Entrar
          </Button>
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-300" />
            <span className="text-sm text-gray-500">ou</span>
            <span className="h-px flex-1 bg-gray-300" />
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-center text-sm text-gray-600">
              Ainda não tem uma conta?
            </p>
            <Button variant="outline" asChild>
              <Link to="/cadastro">
                <UserRoundPlus aria-hidden />
                Criar conta
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
