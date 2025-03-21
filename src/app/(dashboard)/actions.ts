export const wakeServer = async () => {
  await fetch(
    `https://model-${process.env.AI_GENERATION_MODEL_ID}.api.baseten.co/development/wake`,
    {
      method: "POST",
      headers: {
        Authorization: `Api-Key ${process.env.AI_GENERATION_API_KEY}`,
      },
    },
  );
};
