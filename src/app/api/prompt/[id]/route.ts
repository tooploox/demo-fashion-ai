import { dbPromptSchema, toDTOPrompt } from "@/schemas";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const raw = await sql("SELECT * FROM prompts WHERE id = $1", [id]);
  const data = dbPromptSchema.parse(raw[0]);

  return NextResponse.json(toDTOPrompt(data));
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await sql("DELETE FROM prompts WHERE id = $1", [id]);

  return NextResponse.json({ success: true });
}
