"use server";

import { stackServerApp } from "@/stack";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";

const basetenResponseSchema = z.object({
  request_id: z.string().optional(),
  error: z.string().optional(),
});

export async function generate(
  file: File,
  promptOptions: Record<string, string>,
) {
  const sql = neon(process.env.DATABASE_URL!);

  const user = await stackServerApp.getUser();
  if (!user) return { error: "User not authenticated" };

  const currentTokens = user.clientReadOnlyMetadata.tokens;
  if (!currentTokens) return { error: "User has no tokens" };

  const blob = await put(`${user.id}/${crypto.randomUUID()}`, file, {
    access: "public",
  });

  // TODO: LLM - Implement the AI for description
  const description =
    "A middle-aged Nordic woman stands confidently in a photo studio, surrounded by a professional lighting setup. She has cool-toned blonde hair and striking blue eyes, reflecting her Nordic heritage. Dressed in an elegant winter ensemble, she exudes sophistication and warmth despite the chilly season. The studio’s soft lighting highlights the texture of her cozy, high-quality knitwear, adding depth and realism to the image.";

  const resp = await fetch(
    `${process.env.AI_GENERATION_URL}/development/async_predict`,
    {
      method: "POST",
      headers: {
        Authorization: `Api-Key ${process.env.AI_GENERATION_API_KEY}`,
      },
      body: JSON.stringify({
        webhook_endpoint: "https://demo-fashion-ai.vercel.app/api/webhook",
        model_input: {
          workflow_values: {
            product_image: blob.url,
            photo_description: description,
          },
        },
      }),
    },
  );

  const data = basetenResponseSchema.parse(await resp.json());
  if (data.error) {
    return {
      error: data.error,
    };
  }
  if (!data.request_id) {
    return {
      error: "No request ID returned",
    };
  }

  const promptId = crypto.randomUUID();
  await sql(
    "INSERT INTO prompts (id, user_id, prompt_image_url, baseten_request_id, status, prompt_options) VALUES ($1, $2, $3, $4, $5, $6)",
    [
      promptId,
      user.id,
      blob.url,
      data.request_id,
      "in_progress",
      promptOptions,
    ],
  );
  await user.setClientReadOnlyMetadata({ tokens: currentTokens - 1 });

  return { prompt_id: promptId };
}
