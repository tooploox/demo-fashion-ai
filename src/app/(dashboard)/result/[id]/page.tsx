"use client";

import useSWR from "swr";
import { dtoPromptSchema } from "@/schemas";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Fragment } from "react";

const useResult = (id: string | string[] | undefined) => {
  return useSWR(
    id ? `/api/prompt/${id}` : null,
    (...args) =>
      fetch(...args)
        .then((res) => res.json())
        .then((data) => dtoPromptSchema.parse(data)),
    {
      refreshInterval: (data) => (data?.status === "in_progress" ? 5000 : 0),
      shouldRetryOnError: false,
    },
  );
};

export default function ResultPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data } = useResult(id);

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push("/")}>
          <ArrowLeft />
        </Button>
        <h2 className="text-xl font-semibold">Results</h2>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-6">
          <figure className="flex flex-col gap-4 rounded-md bg-gray-50 p-4">
            <figcaption className="text-sm font-semibold">Options</figcaption>
            <div className="grid grid-cols-[min-content_auto] gap-2 gap-x-6">
              {Object.entries(data?.promptOptions ?? {}).map(([key, value]) => (
                <Fragment key={key}>
                  <p className="text-sm font-medium">{key}</p>
                  <p className="text-sm">{value}</p>
                </Fragment>
              ))}
            </div>
          </figure>
          <figure className="flex flex-col gap-4 rounded-md bg-gray-50 p-4">
            <figcaption className="text-sm font-semibold">Input</figcaption>
            <img src={data?.promptImageUrl} alt="" />
          </figure>
          <figure className="flex flex-col gap-4 rounded-md bg-gray-50 p-4">
            <figcaption className="text-sm font-semibold">Output</figcaption>
            {data?.resultImageUrl ? (
              <img src={data?.resultImageUrl} alt="" />
            ) : (
              <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
                {data?.status === "in_progress" ? (
                  <>
                    Processing...
                    <br />
                    Page will refresh automatically.
                  </>
                ) : null}
                {data?.status === "failed"
                  ? "Couldn't generate the image."
                  : null}
              </div>
            )}
          </figure>
        </div>
      </div>
    </div>
  );
}
