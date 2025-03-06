import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";

// https://docs.baseten.co/invoke/async#processing-async-predict-results
const basetenRequestSchema = z.object({
  request_id: z.string(),
  time: z.string(),
  data: z.object({
    result: z
      .array(
        z.object({
          data: z.string(),
          format: z.string(),
        }),
      )
      .optional(),
  }),
  errors: z.array(z.object({ message: z.string() })).optional(),
});

const sql = neon(process.env.DATABASE_URL!);

const setFailedStatus = async (requestId: string) => {
  await sql("UPDATE prompts SET status = $1 WHERE baseten_request_id = $2", [
    "failed",
    requestId,
  ]);
};

export async function POST(req: Request) {
  const json = await req.json();

  console.log(JSON.stringify(json));

  const { request_id, data, errors } = basetenRequestSchema.parse(json);

  if (!data.result) {
    console.error(errors?.map((e) => e.message).join(", "));
    await setFailedStatus(request_id);
    return new Response("Failed", { status: 400 });
  }

  const result = data.result[0];

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
    await setFailedStatus(request_id);
  }

  return NextResponse.json({ success: true });
}
