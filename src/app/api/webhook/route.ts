import { z } from "zod";

// https://docs.baseten.co/invoke/async#processing-async-predict-results
const basetenRequestSchema = z.object({
  request_id: z.string(),
  time: z.string(),
  data: z.any(),
});

export async function POST(req: Request) {
  const json = await req.json();
  const data = basetenRequestSchema.parse(json);
  console.log(data);
  // TODO: save result to database
}
