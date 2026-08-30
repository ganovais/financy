import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut, Mail, UserRound } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Field,
  FieldHelper,
  FieldLabel,
  Input,
  InputAdornment,
  InputRoot,
} from "@/components/ui/input";
import { getInitials } from "@/lib/format";
import { mockUser } from "@/lib/mock-data";

const profileSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const navigate = useNavigate();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: mockUser.name },
  });

  const currentName = useWatch({ control: form.control, name: "name" });

  async function handleSave(values: ProfileFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    form.reset(values);
  }

  return (
    <div className="flex justify-center">
      <section className="flex w-full max-w-md flex-col gap-8 rounded-xl border border-border bg-white p-8">
        <header className="flex flex-col items-center gap-6">
          <span className="flex size-16 items-center justify-center rounded-full bg-gray-300 text-2xl leading-10 font-medium text-gray-800">
            {getInitials(currentName || mockUser.name)}
          </span>
          <div className="flex flex-col gap-0.5 text-center">
            <h1 className="text-xl leading-7 font-semibold text-gray-800">
              {currentName || mockUser.name}
            </h1>
            <p className="text-base text-gray-500">{mockUser.email}</p>
          </div>
        </header>
        <hr className="border-border" />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSave)}
            noValidate
            className="flex flex-col gap-8"
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
                        <Input autoComplete="name" {...field} />
                      </FormControl>
                    </InputRoot>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Field>
                <FieldLabel htmlFor="profile-email">E-mail</FieldLabel>
                <InputRoot>
                  <InputAdornment>
                    <Mail aria-hidden />
                  </InputAdornment>
                  <Input
                    id="profile-email"
                    type="email"
                    value={mockUser.email}
                    disabled
                    readOnly
                  />
                </InputRoot>
                <FieldHelper>O e-mail não pode ser alterado</FieldHelper>
              </Field>
            </div>
            <div className="flex flex-col gap-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Salvar alterações
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
              >
                <LogOut aria-hidden />
                Sair da conta
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
}
