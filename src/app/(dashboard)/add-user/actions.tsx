"use server";

import { stackServerApp } from "@/stack";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function createInvitation(prevState: unknown, formData: FormData) {
  const currentUser = await stackServerApp.getUser();

  const teams = await currentUser?.listTeams();
  const isSalesTeam = teams?.find((team) => team.displayName === "sales");

  if (!currentUser || !isSalesTeam) {
    return {
      error:
        "Unauthorized: Only admins or sales team members can create invitations.",
    };
  }

  const email = formData.get("email") as string;
  if (!email) {
    return { error: "Email is required." };
  }

  await sql("INSERT INTO invitations (email, used) VALUES ($1, FALSE)", [
    email,
  ]);

  return {
    inviteUrl: `/register?invitation=${email}`,
  };
}
