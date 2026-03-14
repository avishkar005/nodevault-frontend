"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Pin, Heart, Copy, Check, Pencil, Trash2,
  Calendar, Clock, Tag, Image as ImageIcon,
} from "lucide-react";
import { useNotes } from "@/context/NotesContext";
import { Button } from "@/components/ui/button";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { toast } from "@/hooks/useToast";
import { copyToClipboard, formatDateTime, formatDate } from "@/lib/utils";

export default function NoteDetailPage() {

  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { notes, togglePin, toggleFavorite, deleteNote } = useNotes();

  const note = notes.find((n) => String(n.id) === String(id));

  const [editorOpen, setEditorOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // ✅ SAFE FALLBACKS
  const images = Array.isArray(note?.images) ? note.images : [];
  const tags = Array.isArray(note?.tags) ? note.tags : [];

  if (!note) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--muted-foreground)" }}>
        <p style={{ marginBottom: 12 }}>Note not found.</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const handleCopy = async () => {
    await copyToClipboard(note.content);
    setCopied(true);
    toast({ title: "Copied to clipboard", variant: "success" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteNote(note.id);
      toast({ title: "Note deleted" });
      router.replace("/notes");
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{ maxWidth: 760, margin: "0 auto", padding: "24px 28px" }}
    >
      {/* Back */}
      <button
        onClick={() => router.back()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "var(--muted-foreground)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 0",
          marginBottom: 22,
        }}
      >
        <ArrowLeft size={14} />
        Back
      </button>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <h1
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: "var(--foreground)",
              lineHeight: 1.3,
              flex: 1,
            }}
          >
            {note.title || "Untitled"}
          </h1>

          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button onClick={() => togglePin(note.id)}>
              <Pin size={13} />
            </button>

            <button onClick={() => toggleFavorite(note.id)}>
              <Heart size={13} fill={note.favorite ? "#E05A5A" : "none"} />
            </button>

            <button onClick={handleCopy}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>

            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => setEditorOpen(true)}
            >
              <Pencil size={13} />
            </Button>

            <Button
              size="icon-sm"
              variant="outline"
              onClick={handleDelete}
            >
              <Trash2 size={13} />
            </Button>
          </div>
        </div>

        {/* Meta */}
        <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12,
            }}
          >
            <Calendar size={11} />
            Created {formatDate(note.createdAt)}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12,
            }}
          >
            <Clock size={11} />
            Updated {formatDateTime(note.updatedAt ?? note.createdAt)}
          </span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
              marginTop: 12,
            }}
          >
            {tags.map((tag: string, idx: number) => (
              <span key={idx} className="tag-pill">
                <Tag size={9} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: 1, background: "var(--border)", marginBottom: 24 }} />

      <div style={{ fontSize: 14.5, lineHeight: 1.75, marginBottom: 28 }}>
        {note.content}
      </div>

      {/* Images */}
      {images.length > 0 && (
        <div>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12.5,
              marginBottom: 12,
            }}
          >
            <ImageIcon size={13} />
            {images.length} image{images.length > 1 ? "s" : ""}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            {images.map((img: any, idx: number) => (
              <img
                key={img?.id ?? idx}
                src={img?.url || ""}
                alt={img?.name || "image"}
                style={{ width: "100%", borderRadius: 8 }}
              />
            ))}
          </div>
        </div>
      )}

      <NoteEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        note={note}
        mode="edit"
      />
    </div>
  );
}