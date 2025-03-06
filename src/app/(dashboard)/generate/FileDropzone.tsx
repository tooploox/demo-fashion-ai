"use client";

import type * as React from "react";
import { useCallback, useState } from "react";
import { FileIcon, UploadCloudIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FileWithPreview extends File {
  preview?: string;
}

interface FileDropzoneProps {
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string;
  onFilesAdded?: (files: File[]) => void;
  className?: string;
}

export function FileDropzone({
  maxFiles = 1,
  maxSize = 4.5, // 4.5MB
  accept = "image/*",
  onFilesAdded,
  className,
}: FileDropzoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      // Check if adding these files would exceed the max files limit
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} files`);
        return;
      }

      // Filter files that are too large
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > maxSize * 1024 * 1024) {
          setError(
            `File "${file.name}" is too large. Max size is ${maxSize}MB.`,
          );
          return false;
        }
        return true;
      });

      // Add preview URLs for images
      const filesWithPreviews = validFiles.map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
        }),
      );

      setFiles((prev) => [...prev, ...filesWithPreviews]);

      if (onFilesAdded && validFiles.length > 0) {
        onFilesAdded(validFiles);
      }
    },
    [files, maxFiles, maxSize, onFilesAdded],
  );

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const file = newFiles[index];

      // Revoke the object URL to avoid memory leaks
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }

      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        onDrop(droppedFiles);
      }
    },
    [onDrop],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFiles = Array.from(e.target.files);
        onDrop(selectedFiles);
      }
    },
    [onDrop],
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-6 transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <UploadCloudIcon className="mb-2 h-10 w-10 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium">
            Drag and drop files here or click to browse
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Supports {accept.split(",").join(", ")} (Max: {maxSize}MB per file,
            up to {maxFiles} files)
          </p>
        </div>
        <input
          type="file"
          id="fileInput"
          className="sr-only"
          multiple
          accept={accept}
          onChange={handleFileInputChange}
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

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Files ({files.length}/{maxFiles})
          </p>
          <ul className="divide-y divide-border rounded-md border bg-white">
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
                    <p className="max-w-[200px] truncate text-sm font-medium">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
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
      )}
    </div>
  );
}
