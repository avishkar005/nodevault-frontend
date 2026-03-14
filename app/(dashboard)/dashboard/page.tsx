"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pin, Heart, FileText, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotes } from "@/context/NotesContext";
import { Button } from "@/components/ui/button";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { NotesGrid } from "@/components/notes/NotesGrid";
import { PageHeader } from "@/components/shared/PageHeader";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useRouter } from "next/navigation";

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "var(--foreground)",
            lineHeight: 1.2,
          }}
        >
          {value}
        </p>
        <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const {
    notes,
    filteredNotes,
    searchQuery,
    sortBy,
    layout,
    setSearchQuery,
    setSortBy,
    setLayout,
  } = useNotes();

  const router = useRouter();
  const [editorOpen, setEditorOpen] = useState(false);

  useKeyboardShortcut("n", () => setEditorOpen(true), { ctrlKey: true });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // 🔥 VERY IMPORTANT FIX
  if (isLoading) return null;
  if (!isAuthenticated) return null;
  if (!user) return null;

  const recentNotes = filteredNotes.slice(0, 6);
  const pinnedCount = notes.filter((n) => n.pinned).length;
  const favoriteCount = notes.filter((n) => n.favorite).length;
  const greeting = getGreeting();

  return (
    <div className="animate-fade-in" style={{ minHeight: "100vh" }}>
      <PageHeader
        title="Dashboard"
        subtitle={`${greeting}, ${user.name?.split(" ")[0] ?? "there"}`}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        layout={layout}
        onLayoutChange={setLayout}
        sortBy={sortBy}
        onSortChange={setSortBy}
        action={
          <Button
            size="sm"
            onClick={() => setEditorOpen(true)}
            style={{ gap: 6, fontSize: 13 }}
          >
            <Plus size={14} />
            New Note
          </Button>
        }
      />

      <div style={{ padding: "22px 28px" }}>
        {!searchQuery && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 10,
              marginBottom: 28,
            }}
          >
            <StatCard
              icon={<FileText size={16} style={{ color: "#3B82F6" }} />}
              label="Total Notes"
              value={notes.length}
              color="#EFF6FF"
            />
            <StatCard
              icon={<Pin size={16} style={{ color: "var(--brand)" }} />}
              label="Pinned"
              value={pinnedCount}
              color="var(--brand-light)"
            />
            <StatCard
              icon={<Heart size={16} style={{ color: "#E05A5A" }} />}
              label="Favorites"
              value={favoriteCount}
              color="#FEF2F2"
            />
            <StatCard
              icon={<TrendingUp size={16} style={{ color: "#10B981" }} />}
              label="This Week"
              value={
                notes.filter((n) => {
                  const d = new Date(n.createdAt);
                  const now = new Date();
                  const weekAgo = new Date(
                    now.getTime() - 7 * 86400000
                  );
                  return d >= weekAgo;
                }).length
              }
              color="#F0FDF4"
            />
          </div>
        )}

        <NotesGrid
          notes={searchQuery ? filteredNotes : recentNotes}
          layout={layout}
          emptyMessage={searchQuery ? "No results found" : "No notes yet"}
          emptyDescription={
            searchQuery
              ? `No notes match "${searchQuery}"`
              : "Click New Note to create your first note."
          }
        />
      </div>

      <NoteEditor open={editorOpen} onClose={() => setEditorOpen(false)} />
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}