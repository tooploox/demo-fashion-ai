"use client";

import { Button } from "@/components/ui/button";
import { Sparkle } from "lucide-react";
import Link from "next/link";

const items = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1707932495000-5748b915e4f2?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My generations</h2>
        <Button variant="outline" asChild>
          <Link href="/generate">
            <Sparkle /> Generate new
          </Link>
        </Button>
      </div>

      <ul className="grid grid-cols-[repeat(auto-fill,200px)] gap-4">
        {items.map((item) => (
          <Item key={item} src={item} />
        ))}
      </ul>
    </div>
  );
}

type ItemProps = {
  src: string;
};
const Item = ({ src }: ItemProps) => {
  return (
    <li className="h-full overflow-hidden rounded-md border">
      <img src={src} className="h-full w-full object-cover" />
    </li>
  );
};
