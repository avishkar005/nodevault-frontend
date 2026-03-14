"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Pin, Heart, Trash2, Copy, Check, MoreHorizontal, Image as ImageIcon } from "lucide-react";
import { Note } from "@/types";
import { formatRelativeDate, truncate, copyToClipboard } from "@/lib/utils";
import { useNotes } from "@/context/NotesContext";
import { toast } from "@/hooks/useToast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NoteCardProps {
  note: Note;
  layout?: "grid" | "list";
}

export function NoteCard({ note, layout = "grid" }: NoteCardProps) {
  const router = useRouter();
  const { togglePin, toggleFavorite, deleteNote } = useNotes();
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // 🔥 SAFE FALLBACKS (VERY IMPORTANT)
  const images = note.images ?? [];
  const tags = note.tags ?? [];

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await copyToClipboard(note.content);
    setCopied(true);
    toast({ title: "Copied to clipboard", variant: "success" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete) {
      deleteNote(note.id);
      toast({ title: "Note deleted" });
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePin(note.id);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(note.id);
  };

  if (layout === "list") {
    return (
      <div
        className="glass-card animate-slide-in"
        onClick={() => router.push(`/notes/${note.id}`)}
        style={{ cursor: "pointer", padding: "12px 16px", display: "flex", alignItems: "center", gap: 16 }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            {note.pinned && <Pin size={11} style={{ color: "var(--brand)", flexShrink: 0 }} />}
            <h3 style={{ fontSize: 14, fontWeight: 500, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {note.title || "Untitled"}
            </h3>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {truncate(note.content, 120)}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag-pill" style={{ display: "none" }}>{tag}</span>
          ))}
          <span style={{ fontSize: 11.5, color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>
            {formatRelativeDate(note.updatedAt ?? note.createdAt)}
          </span>
          <NoteActions
            note={note}
            onCopy={handleCopy}
            onPin={handlePin}
            onFavorite={handleFavorite}
            onDelete={handleDelete}
            copied={copied}
            confirmDelete={confirmDelete}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-card animate-slide-in"
      onClick={() => router.push(`/notes/${note.id}`)}
      style={{ cursor: "pointer", padding: "16px", display: "flex", flexDirection: "column", gap: 10, position: "relative" }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--foreground)",
            lineHeight: 1.4,
            flex: 1,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {note.title || "Untitled"}
        </h3>
        <div onClick={(e) => e.stopPropagation()} style={{ flexShrink: 0, marginTop: -2 }}>
          <NoteActions
            note={note}
            onCopy={handleCopy}
            onPin={handlePin}
            onFavorite={handleFavorite}
            onDelete={handleDelete}
            copied={copied}
            confirmDelete={confirmDelete}
          />
        </div>
      </div>

      {/* Content preview */}
      <p
        style={{
          fontSize: 12.5,
          color: "var(--muted-foreground)",
          lineHeight: 1.55,
          flex: 1,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        {note.content || "No content"}
      </p>

      {/* Images indicator */}
      {images.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--muted-foreground)" }}>
          <ImageIcon size={11} />
          <span style={{ fontSize: 11 }}>
            {images.length} image{images.length > 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
          {tags.length > 3 && (
            <span className="tag-pill">+{tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
          {formatRelativeDate(note.updatedAt ?? note.createdAt)}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {note.pinned && <Pin size={11} style={{ color: "var(--brand)" }} />}
          {note.favorite && <Heart size={11} style={{ color: "#E05A5A", fill: "#E05A5A" }} />}
        </div>
      </div>
    </div>
  );
}

function NoteActions({
  note,
  onCopy,
  onPin,
  onFavorite,
  onDelete,
  copied,
  confirmDelete,
}: {
  note: Note;
  onCopy: (e: React.MouseEvent) => void;
  onPin: (e: React.MouseEvent) => void;
  onFavorite: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  copied: boolean;
  confirmDelete: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--muted-foreground)",
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onCopy}>
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied!" : "Copy content"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onPin}>
          <Pin size={13} />
          {note.pinned ? "Unpin" : "Pin"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onFavorite}>
          <Heart size={13} />
          {note.favorite ? "Unfavorite" : "Add to favorites"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          style={{ color: confirmDelete ? "var(--destructive)" : undefined }}
        >
          <Trash2 size={13} />
          {confirmDelete ? "Confirm delete" : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}