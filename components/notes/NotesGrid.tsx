"use client";

import React from "react";
import { Note, ViewLayout } from "@/types";
import { NoteCard } from "./NoteCard";

interface NotesGridProps {
  notes: Note[];
  layout: ViewLayout;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function NotesGrid({
  notes,
  layout,
  emptyMessage = "No notes yet",
  emptyDescription = "Create your first note to get started.",
}: NotesGridProps) {
  if (!notes || notes.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
        <div className="w-12 h-12 rounded-xl border-2 border-dashed flex items-center justify-center mb-4">
          <span className="text-2xl">📋</span>
        </div>

        <p className="text-sm font-medium text-foreground mb-1">
          {emptyMessage}
        </p>

        <p className="text-xs opacity-70">{emptyDescription}</p>
      </div>
    );
  }

  if (layout === "list") {
    return (
      <div className="flex flex-col gap-2">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} layout="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} layout="grid" />
      ))}
    </div>
  );
}