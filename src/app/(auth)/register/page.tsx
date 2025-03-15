"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from "react";
import { createUser } from "./actions";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(createUser, {
    error: "",
  });

  return (
    <div className="flex h-screen items-center p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Register</h1>
          <p className="text-sm text-muted-foreground">
            Create your account by entering your email and password below
          </p>
        </div>
        <form action={formAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input name="password" id="password" type="password" required />
            </div>
            <p className="text-center text-red-500" aria-live="polite">
              {state?.error}
            </p>
            <Button type="submit" className="w-full" disabled={pending}>
              Register
            </Button>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Sign In
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
