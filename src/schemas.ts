import { z } from "zod";

export const dbPromptSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  baseten_request_id: z.string(),
  prompt_image_url: z.string(),
  result_image_url: z.string().nullable(),
  status: z.enum(["in_progress", "succeeded", "failed"]),
  created_at: z.date(),
});
