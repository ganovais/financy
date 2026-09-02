import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut, Mail, UserRound } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
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
import { useUpdateProfile } from "@/hooks/use-auth-mutations";
import { useAuth, useUser } from "@/lib/auth-context";
import { getInitials } from "@/lib/format";

const profileSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useUser();
  const { signOut } = useAuth();
  const updateProfile = useUpdateProfile();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name },
  });

  const currentName = useWatch({ control: form.control, name: "name" });

  function handleSave(values: ProfileFormValues) {
    updateProfile.mutate(values, {
      onSuccess: (result) => form.reset({ name: result.updateProfile.name }),
    });
  }

  function handleSignOut() {
    signOut();
    toast.info("Você saiu da conta");
    navigate("/", { replace: true });
  }

  return (
    <div className="flex justify-center">
      <section className="flex w-full max-w-md flex-col gap-8 rounded-xl border border-border bg-white p-8">
        <header className="flex flex-col items-center gap-6">
          <span className="flex size-16 items-center justify-center rounded-full bg-gray-300 text-2xl leading-10 font-medium text-gray-800">
            {getInitials(currentName || user.name)}
          </span>
          <div className="flex flex-col gap-0.5 text-center">
            <h1 className="text-xl leading-7 font-semibold text-gray-800">
              {currentName || user.name}
            </h1>
            <p className="text-base text-gray-500">{user.email}</p>
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
                    value={user.email}
                    disabled
                    readOnly
                  />
                </InputRoot>
                <FieldHelper>O e-mail não pode ser alterado</FieldHelper>
              </Field>
            </div>
            <div className="flex flex-col gap-4">
              <Button type="submit" disabled={updateProfile.isPending}>
                Salvar alterações
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
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
