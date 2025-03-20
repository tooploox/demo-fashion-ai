"use server";

import { stackServerApp } from "@/stack";
import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";
import { z } from "zod";

const sql = neon(process.env.DATABASE_URL!);

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

  const storedInvitation = await sql(
    "SELECT * FROM invitations WHERE email = $1",
    [parsed.data.email],
  );

  if (
    !storedInvitation[0] ||
    storedInvitation[0].used ||
    storedInvitation[0].email !== parsed.data.email
  ) {
    return { error: "Invalid or expired invitation" };
  }

  await sql("UPDATE invitations SET used = TRUE WHERE email = $1", [
    parsed.data.email,
  ]);

  const user = await stackServerApp.createUser({
    primaryEmail: parsed.data.email,
    primaryEmailAuthEnabled: true,
    password: parsed.data.password,
  });

  await user.update({
    clientReadOnlyMetadata: {
      tokens: 5,
    },
  });

  redirect("/");
}
