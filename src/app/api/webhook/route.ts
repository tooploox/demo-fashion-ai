// import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { z } from "zod";

// https://docs.baseten.co/invoke/async#processing-async-predict-results
const basetenRequestSchema = z.object({
  request_id: z.string(),
  time: z.string(),
  data: z.object({
    result: z.any(),
  }),
});

export async function POST(req: Request) {
  const json = await req.json();
  const { request_id, data } = basetenRequestSchema.parse(json);

  console.log(request_id, data.result);
  console.log(request_id, JSON.stringify(data.result));

  // const sql = neon(process.env.DATABASE_URL!);
  // await sql("UPDATE prompts SET status = $1 WHERE baseten_request_id = $2", [
  //   "succeded",
  //   request_id,
  // ]);

  return NextResponse.json({ success: true });
}
