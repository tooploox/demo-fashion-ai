import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";

// https://docs.baseten.co/invoke/async#processing-async-predict-results
const basetenRequestSchema = z.object({
  request_id: z.string(),
  time: z.string(),
  data: z.object({
    result: z.array(
      z.object({
        data: z.string(),
        format: z.string(),
      }),
    ),
  }),
});

export async function POST(req: Request) {
  const json = await req.json();

  console.log(JSON.stringify(json));

  const { request_id, data } = basetenRequestSchema.parse(json);
  const result = data.result[0];

  const sql = neon(process.env.DATABASE_URL!);

  let userID = "unknown";
  try {
    const [result] = await sql(
      "SELECT user_id FROM prompts WHERE baseten_request_id = $1",
      [request_id],
    );
    userID = result.user_id;
  } catch {
    // ignore
  }

  try {
    const uuid = crypto.randomUUID();
    const imageBuffer = Buffer.from(result.data, "base64");
    const { url } = await put(
      `${userID}/${uuid}.png`,
      new Blob([imageBuffer], { type: "image/png" }),
      {
        access: "public",
      },
    );
    await sql(
      "UPDATE prompts SET status = $1, result_image_url = $2 WHERE baseten_request_id = $3",
      ["succeeded", url, request_id],
    );
  } catch (error) {
    console.error(error);
    await sql("UPDATE prompts SET status = $1 WHERE baseten_request_id = $2", [
      "failed",
      request_id,
    ]);
  }

  return NextResponse.json({ success: true });
}
