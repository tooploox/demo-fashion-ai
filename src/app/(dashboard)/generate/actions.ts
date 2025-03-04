"use server";

import { stackServerApp } from "@/stack";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";

export async function generate(file: File) {
  const sql = neon(process.env.DATABASE_URL!);

  const user = await stackServerApp.getUser();
  if (!user) throw new Error("User not authenticated");

  const currentTokens = user.clientReadOnlyMetadata.tokens;
  if (!currentTokens) throw new Error("User has no tokens");

  const blob = await put(crypto.randomUUID(), file, {
    access: "public",
  });

  const resp = await fetch(
    `${process.env.AI_GENERATION_URL}/development/async_predict`,
    {
      method: "POST",
      headers: {
        Authorization: `Api-Key ${process.env.AI_GENERATION_API_KEY}`,
      },
      body: JSON.stringify({
        model_input: {
          webhook_endpoint: "https://demo-fashion-ai.vercel.app/api/webhook",
          workflow_values: {
            product_image: blob.url,
          },
        },
      }),
    },
  );

  const data = await resp.json();

  const promptId = crypto.randomUUID();
  await sql(
    "INSERT INTO prompts (id, user_id, prompt_image_url, baseten_request_id, status) VALUES ($1, $2, $3, $4, $5)",
    [promptId, user.id, blob.url, data.request_id, "in_progress"],
  );
  await user.setClientReadOnlyMetadata({ tokens: currentTokens - 1 });

  return { prompt_id: promptId };
}
