"use server";

import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function createUser(prevState: unknown, formData: FormData) {
  const parsed = formSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: "Invalid email or password",
    };
  }

  const user = await stackServerApp.createUser({
    primaryEmail: parsed.data.email,
    primaryEmailAuthEnabled: true,
    password: parsed.data.password,
  });

  await user.update({
    clientReadOnlyMetadata: {
      tokens: 100,
    },
  });

  redirect("/");
}
