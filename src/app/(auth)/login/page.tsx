"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useStackApp } from "@stackframe/stack";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to login to your account
          </p>
        </div>
        <AuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Need an access?
          <br />
          Contact{" "}
          <a
            href="mailto:mateusz.blum@tooploox.com"
            className="underline underline-offset-4"
          >
            mateusz.blum@tooploox.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}

const AuthForm = () => {
  const app = useStackApp();
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (values: FormValues) => {
    await app.signInWithCredential(values);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            {...form.register("email")}
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            {...form.register("password")}
            id="password"
            type="password"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          Login
        </Button>
      </div>
    </form>
  );
};
