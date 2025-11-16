"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

interface ImagePreviewProps {
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  previewUrl?: string;
  disabled?: boolean;
}

export function ImagePreview({
  onFileSelect,
  onRemove,
  previewUrl,
  disabled = false,
}: ImagePreviewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (PNG, JPG, GIF, or WebP)");
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("Image must be less than 10MB");
        return;
      }

      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {!previewUrl ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <ImageIcon className="h-4 w-4" />
          <span className="text-xs">Add Image</span>
        </Button>
      ) : (
        <div className="relative rounded-lg overflow-hidden border bg-muted group">
          <Image
            src={previewUrl}
            alt="Upload preview"
            width={600}
            height={400}
            className="w-full object-cover max-h-64"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
