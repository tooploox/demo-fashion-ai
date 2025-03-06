import { z } from "zod";

export const dbPromptSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  baseten_request_id: z.string(),
  prompt_image_url: z.string(),
  prompt_options: z.record(z.string()).nullable(),
  result_image_url: z.string().nullable(),
  status: z.enum(["in_progress", "succeeded", "failed"]),
  created_at: z.date(),
});

export const dtoPromptSchema = z.object({
  id: z.string(),
  userId: z.string(),
  basetenRequestId: z.string(),
  promptImageUrl: z.string(),
  resultImageUrl: z.string().nullable(),
  promptOptions: z.record(z.string()).nullable(),
  status: z.enum(["in_progress", "succeeded", "failed"]),
  createdAt: z.string(),
});

export const toDTOPrompt = (
  db: z.infer<typeof dbPromptSchema>,
): z.infer<typeof dtoPromptSchema> => ({
  id: db.id,
  userId: db.user_id,
  basetenRequestId: db.baseten_request_id,
  promptImageUrl: db.prompt_image_url,
  resultImageUrl: db.result_image_url,
  promptOptions: db.prompt_options,
  status: db.status,
  createdAt: db.created_at.toISOString(),
});

export const promptOptions = {
  Gender: ["Woman", "Man"],
  Age: ["Young adult", "Middle age", "Mature"],
  Location: ["City street", "Photo studio", "Rooftop", "Beach"],
  Ethnicity: ["European", "East-asian", "Nordic", "Afro-descendent"],
  Season: ["Spring", "Summer", "Autumn", "Winter"],
};
