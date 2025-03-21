import { Button } from "@/components/ui/button";
import { dbPromptSchema } from "@/schemas";
import { stackServerApp } from "@/stack";
import { neon } from "@neondatabase/serverless";
import { Sparkle } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { Item } from "./Item";

const sql = neon(process.env.DATABASE_URL!);

// const examples = [
//   "https://plus.unsplash.com/premium_photo-1739899051410-af2e7a9c0f2e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://plus.unsplash.com/premium_photo-1739899051410-af2e7a9c0f2e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://plus.unsplash.com/premium_photo-1739899051410-af2e7a9c0f2e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://plus.unsplash.com/premium_photo-1739899051410-af2e7a9c0f2e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// ];

export default async function HomePage() {
  const user = await stackServerApp.getUser();
  const raw = await sql(
    "SELECT * FROM prompts WHERE user_id = $1 ORDER BY created_at DESC",
    [user?.id],
  );
  const items = z.array(dbPromptSchema).parse(raw);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Generated images</h2>
        <Button asChild>
          <Link href="/generate">
            <Sparkle /> Generate new
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <>
          <div className="flex flex-col items-center gap-4 rounded-lg bg-zinc-50 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nothing here… yet! Try generating an image and see the magic
              happen.
            </p>
          </div>

          {/* <div>
            <p className="mb-4 text-sm font-semibold">Example images</p>
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
              {examples.map((url, index) => (
                <li key={index}>
                  <img
                    src="https://plus.unsplash.com/premium_photo-1739899051410-af2e7a9c0f2e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="h-full w-full rounded-md object-cover"
                  />
                </li>
              ))}
            </ul>
          </div> */}
        </>
      ) : null}

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {items.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            status={item.status}
            resultUrl={item.result_image_url}
            promptUrl={item.prompt_image_url}
          />
        ))}
      </ul>
    </div>
  );
}
