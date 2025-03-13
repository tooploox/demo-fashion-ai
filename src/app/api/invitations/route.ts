import { NextResponse } from "next/server";

import { neon } from "@neondatabase/serverless";
import { stackServerApp } from "@/stack";
import { dbInvitationSchema, toDTOInvitation } from "@/schemas";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teams = (await user?.listTeams()) || [];
    const isSalesTeam = teams.some((team) => team.displayName === "sales");

    if (!isSalesTeam) {
      return NextResponse.json(
        { error: "Forbidden: Sales Team Only" },
        { status: 403 },
      );
    }

    const invitations = await sql(
      "SELECT id, email, used, created_at FROM invitations",
    );
    console.log(invitations);
    const parsedInvitations = invitations.map((val) =>
      dbInvitationSchema.parse(val),
    );

    return NextResponse.json(parsedInvitations.map(toDTOInvitation));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch active invitations" },
      { status: 500 },
    );
  }
}
