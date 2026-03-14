"use client";

import React, { useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { NoteImage } from "@/types";
import { generateId } from "@/lib/utils";
import { toast } from "@/hooks/useToast";

interface UploadImageProps {
  images: NoteImage[];
  onChange: (images: NoteImage[]) => void;
}

export function UploadImage({ images, onChange }: UploadImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages: NoteImage[] = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast({ title: "Only image files are supported", variant: "destructive" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Image too large (max 5MB)", variant: "destructive" });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push({
          id: generateId(),
          url: e.target?.result as string,
          name: file.name,
          size: file.size,
        });
        processed++;
        if (processed === files.length) {
          onChange([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Upload zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: "1.5px dashed var(--border)",
          borderRadius: 8,
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          cursor: "pointer",
          transition: "border-color 0.15s, background 0.15s",
          background: "var(--secondary)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--foreground)";
          (e.currentTarget as HTMLDivElement).style.background = "var(--card)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLDivElement).style.background = "var(--secondary)";
        }}
      >
        <Upload size={16} style={{ color: "var(--muted-foreground)" }} />
        <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", textAlign: "center" }}>
          Click to upload or drag & drop
        </p>
        <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>PNG, JPG, GIF up to 5MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }}>
          {images.map((img) => (
            <div key={img.id} style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "1", border: "1px solid var(--border)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                onClick={() => removeImage(img.id)}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
