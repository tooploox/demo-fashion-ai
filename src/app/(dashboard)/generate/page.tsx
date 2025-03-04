"use client";

import { Button } from "@/components/ui/button";
import { FileDropzone } from "./FileDropzone";
import { useState } from "react";
import { generate } from "./actions";
import { useRouter } from "next/navigation";

export default function GeneratePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Generate</h2>
      </div>

      <div className="flex flex-col gap-6">
        <FileDropzone onFilesAdded={(files) => setFile(files[0])} />
        <Button
          className="self-end"
          onClick={async () => {
            if (!file) return;
            setLoading(true);
            const data = await generate(file);
            router.push(`/result/${data.prompt_id}`);
          }}
          disabled={loading}
        >
          Generate
        </Button>
      </div>
    </div>
  );
}
