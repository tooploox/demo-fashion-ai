"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import Link from "next/link";

type ItemProps = {
  id: string;
  status: "in_progress" | "succeeded" | "failed";
  resultUrl: string | null;
  promptUrl: string;
};

const useDeletePrompt = () => {
  return (id: string) => {
    fetch(`/api/prompt/${id}`, { method: "DELETE" });
  };
};

export function Item({ id, status, resultUrl, promptUrl }: ItemProps) {
  const deletePrompt = useDeletePrompt();

  // A small button that sits in the top-right corner, on top of the image
  const DeleteButton = (
    <Button
      variant="ghost"
      size="sm"
      className="absolute top-2 right-2 z-10 bg-white/70 hover:bg-white"
      onClick={async (e) => {
        // Prevent clicking the <Link> if the user only intended to delete
        e.stopPropagation();
        e.preventDefault();
        await deletePrompt(id);
        window.location.reload();
      }}
    >
      <Trash className="h-4 w-4" />
    </Button>
  );

  if (status === "succeeded") {
    return (
      <li className="relative h-full overflow-hidden rounded-md border">
        {DeleteButton}
        <Link href={`/result/${id}`}>
          <img
            src={resultUrl ?? undefined}
            className="h-full w-full object-cover"
            alt="Generated result"
          />
        </Link>
      </li>
    );
  }

  if (status === "failed") {
    return (
      <li className="relative h-full overflow-hidden rounded-md border">
        {DeleteButton}
        <p className="pointer-events-none absolute inset-0 grid place-items-center bg-black/80 text-sm text-white">
          Failed
        </p>
        <Link href={`/result/${id}`}>
          <img
            src={promptUrl}
            className="h-full w-full object-cover"
            alt="Failed prompt"
          />
        </Link>
      </li>
    );
  }

  // in_progress case
  return (
    <li className="relative h-full overflow-hidden rounded-md border">
      {DeleteButton}
      <p className="pointer-events-none absolute inset-0 grid place-items-center bg-black/80 text-sm text-white">
        In progress
      </p>
      <Link href={`/result/${id}`}>
        <img
          src={promptUrl}
          className="h-full w-full object-cover"
          alt="Prompt in progress"
        />
      </Link>
    </li>
  );
}
