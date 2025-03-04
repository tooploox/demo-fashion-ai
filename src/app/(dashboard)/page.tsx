import { Button } from "@/components/ui/button";
import { dbPromptSchema } from "@/schemas";
import { stackServerApp } from "@/stack";
import { neon } from "@neondatabase/serverless";
import { Sparkle } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

const sql = neon(process.env.DATABASE_URL!);

export default async function HomePage() {
  const user = await stackServerApp.getUser();
  const raw = await sql("SELECT * FROM prompts WHERE user_id = $1", [user?.id]);
  const items = z.array(dbPromptSchema).parse(raw);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Generated outfits</h2>
        <Button variant="outline" asChild>
          <Link href="/generate">
            <Sparkle /> Generate new
          </Link>
        </Button>
      </div>

      <ul className="grid grid-cols-[repeat(auto-fill,200px)] gap-4">
        {items.map((item) => (
          // TODO: use generated image / status
          <Item key={item.id} id={item.id} src={item.prompt_image_url} />
        ))}
      </ul>
    </div>
  );
}

type ItemProps = {
  id: string;
  src: string;
};
const Item = ({ id, src }: ItemProps) => {
  return (
    <li className="h-full overflow-hidden rounded-md border">
      <Link href={`/result/${id}`}>
        <img src={src} className="h-full w-full object-cover" />
      </Link>
    </li>
  );
};
