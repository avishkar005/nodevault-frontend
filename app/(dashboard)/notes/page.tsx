"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNotes } from "@/context/NotesContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { NotesGrid } from "@/components/notes/NotesGrid";
import { PageHeader } from "@/components/shared/PageHeader";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useRouter } from "next/navigation";

export default function NotesPage() {

  const { filteredNotes, notes, searchQuery, sortBy, layout, setSearchQuery, setSortBy, setLayout } = useNotes();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [editorOpen, setEditorOpen] = useState(false);

  useKeyboardShortcut("n", () => setEditorOpen(true), { ctrlKey: true });

  // 🔥 AUTH GUARD (VERY IMPORTANT)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="All Notes"
        subtitle={`${notes.length} note${notes.length !== 1 ? "s" : ""} total`}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        layout={layout}
        onLayoutChange={setLayout}
        sortBy={sortBy}
        onSortChange={setSortBy}
        action={
          <Button size="sm" onClick={() => setEditorOpen(true)} style={{ gap: 6, fontSize: 13 }}>
            <Plus size={14} />
            New Note
          </Button>
        }
      />
      <div style={{ padding: "22px 28px" }}>
        <NotesGrid
          notes={filteredNotes}
          layout={layout}
          emptyMessage={searchQuery ? "No results" : "No notes yet"}
          emptyDescription={
            searchQuery
              ? `No notes match "${searchQuery}"`
              : "Start capturing important information."
          }
        />
      </div>
      <NoteEditor open={editorOpen} onClose={() => setEditorOpen(false)} />
    </div>
  );
}