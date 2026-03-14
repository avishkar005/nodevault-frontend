"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useNotes } from "@/context/NotesContext";
import { Button } from "@/components/ui/button";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { NotesGrid } from "@/components/notes/NotesGrid";
import { PageHeader } from "@/components/shared/PageHeader";

export default function PinnedPage() {
  const { filteredNotes, searchQuery, sortBy, layout, setSearchQuery, setSortBy, setLayout } = useNotes();
  const [editorOpen, setEditorOpen] = useState(false);

  const pinned = filteredNotes.filter((n) => n.pinned);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Pinned Notes"
        subtitle={`${pinned.length} pinned note${pinned.length !== 1 ? "s" : ""}`}
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
          notes={pinned}
          layout={layout}
          emptyMessage="No pinned notes"
          emptyDescription="Pin important notes to keep them at the top."
        />
      </div>
      <NoteEditor open={editorOpen} onClose={() => setEditorOpen(false)} />
    </div>
  );
}
