import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Mail, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputAdornment, InputRoot } from "@/components/ui/input";

const signUpSchema = z.object({
  name: z.string().min(3, "Informe seu nome completo"),
  email: z.email("Informe um e-mail válido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const navigate = useNavigate();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function handleSignUp() {
    await new Promise((resolve) => setTimeout(resolve, 600));
    navigate("/dashboard");
  }

  return (
    <>
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold text-gray-800">Criar conta</h1>
        <p className="text-base text-gray-600">
          Comece a controlar suas finanças ainda hoje
        </p>
      </header>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignUp)}
          noValidate
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <InputRoot>
                    <InputAdornment>
                      <UserRound aria-hidden />
                    </InputAdornment>
                    <FormControl>
                      <Input
                        placeholder="Seu nome completo"
                        autoComplete="name"
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
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>A senha deve ter no mínimo 8 caracteres</FormMessage>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Cadastrar
          </Button>
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-300" />
            <span className="text-sm text-gray-500">ou</span>
            <span className="h-px flex-1 bg-gray-300" />
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-center text-sm text-gray-600">Já tem uma conta?</p>
            <Button variant="outline" asChild>
              <Link to="/login">
                <LogIn aria-hidden />
                Fazer login
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
