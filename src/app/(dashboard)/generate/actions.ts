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

  const descriptionGPT = await fetch(
    `${process.env.OPENAI_API_URL}/v1/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: `Prepare a descriptive prompt for Flux image generation model, using the below data: ${Object.entries(
          promptOptions,
        )
          .map((v) => v.join("- "))
          .join(", ")}`,
        max_tokens: 200,
        temperature: 1,
      }),
    },
  );

  const description = (
    (await descriptionGPT.json()) as { choices?: { text: string }[] }
  )?.choices?.[0]?.text;

  if (!description) {
    return {
      error: "Failed to generate description",
    };
  }

  const resp = await fetch(
    `https://model-${process.env.AI_GENERATION_MODEL_ID}.api.baseten.co/development/async_predict`,
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
            image_description: description,
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
  await user.setClientReadOnlyMetadata({
    tokens: currentTokens - 1,
    isAdmin: user.clientReadOnlyMetadata.isAdmin,
  });

  return { prompt_id: promptId };
}
