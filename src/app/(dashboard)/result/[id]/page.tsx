import { dbPromptSchema } from "@/schemas";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const raw = await sql("SELECT * FROM prompts WHERE id = $1", [id]);
  const data = dbPromptSchema.parse(raw[0]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Result</h2>
      </div>

      <div className="flex flex-col gap-6">
        <p>ID: {data.id}</p>
        <p>Status: {data.status}</p>
        <p>Baseten request id: {data.baseten_request_id}</p>
        <img className="w-[128px]" src={data.prompt_image_url} alt="" />
      </div>
    </div>
  );
}
