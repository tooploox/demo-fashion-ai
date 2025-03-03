"use client";

import { Button } from "@/components/ui/button";
import { UploadCloudIcon } from "lucide-react";

export default function GeneratePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Generate</h2>
      </div>

      <div className="flex flex-col gap-6">
        <Dropzone />
        <Button className="self-end">Generate</Button>
      </div>
    </div>
  );
}

const Dropzone = () => {
  return (
    <div className="space-y-4">
      <div
        className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-primary/50"
        // onDragEnter={handleDragEnter}
        // onDragLeave={handleDragLeave}
        // onDragOver={handleDragOver}
        // onDrop={handleDrop}
      >
        <UploadCloudIcon className="mb-2 h-10 w-10 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium">
            Drag and drop files here or click to browse
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Supports .jpg, .png
          </p>
        </div>
        <input
          type="file"
          id="fileInput"
          className="sr-only"
          multiple
          //   onChange={handleFileInputChange}
        />
        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          Select Files
        </Button>
      </div>

      {/* {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>} */}

      {/* {uploadProgress !== null && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )} */}

      {/* {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Uploaded Files ({files.length}/{maxFiles})
          </p>
          <ul className="divide-y divide-border rounded-md border">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  {file.preview ? (
                    <div className="h-10 w-10 overflow-hidden rounded-md">
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <FileIcon className="h-10 w-10 text-muted-foreground" />
                  )}
                  <div className="space-y-1">
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};
