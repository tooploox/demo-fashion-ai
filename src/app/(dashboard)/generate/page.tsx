"use client";

import { Button } from "@/components/ui/button";
import { FileDropzone } from "./FileDropzone";
import { useState } from "react";
import { generate } from "./actions";
import { useRouter } from "next/navigation";
import { RadioOptions } from "@/components/RadioOptions";
import { promptOptions } from "@/schemas";

const getRandomOptions = () =>
  Object.entries(promptOptions).reduce(
    (acc, [key, values]) => {
      acc[key] = values[Math.floor(Math.random() * values.length)];
      return acc;
    },
    {} as Record<string, string>,
  );

export default function GeneratePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [options, setOptions] =
    useState<Record<string, string>>(getRandomOptions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const randomDetails = () => {
    setOptions(getRandomOptions());
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center">
        <h2 className="text-xl font-semibold">Generate</h2>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex gap-8">
          <div className="flex grow flex-col gap-2 rounded-md bg-gray-50 p-4">
            <h3 className="text-sm font-semibold">Upload image</h3>
            <p className="text-sm text-muted-foreground">
              Best if the image is clear, well-lit, and features a single top
              garment laid flat.
            </p>
            <FileDropzone
              className="mb-8"
              onFilesAdded={(files) => setFile(files[0])}
            />

            <h3 className="text-sm font-semibold">
              Define details for your photo
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Limited options presented. You can make all details{" "}
              <button
                onClick={randomDetails}
                className="cursor-pointer underline underline-offset-4 hover:text-black"
              >
                random
              </button>
              .
            </p>

            <div className="flex flex-col gap-4">
              {Object.entries(promptOptions).map(([key, values]) => (
                <RadioOptions
                  key={key}
                  label={key}
                  options={values}
                  onChange={(v) =>
                    setOptions((prev) => ({ ...prev, [key]: v }))
                  }
                  value={options[key] ?? ""}
                />
              ))}
            </div>

            <Button
              className="mt-3 self-end"
              onClick={async () => {
                if (!file) return;
                setLoading(true);
                try {
                  const data = await generate(file, options);
                  if (data.error) {
                    setError(data.error);
                    return;
                  }
                  router.push(`/result/${data.prompt_id}`);
                } catch {
                  setError("Something went wrong.");
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              Generate
            </Button>

            {error ? (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}
          </div>
          <div className="hidden sm:block">
            <div className="flex w-[300px] flex-col self-start p-4">
              <p className="mb-2 text-sm font-semibold">Example image</p>
              <img
                src="https://jzuanp7stejvttk1.public.blob.vercel-storage.com/static/upload-example-ZWIlQminJp6i4PpO7RPtuGUPg4aSdq.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
