"use client";

import React,
{
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Note, NoteFormData, SortOption, ViewLayout } from "@/types";
import { useAuth } from "@/context/AuthContext";
const API = "http://localhost:8080/api/notes";

interface NotesContextType {
  notes: Note[];
  filteredNotes: Note[];
  searchQuery: string;
  sortBy: SortOption;
  layout: ViewLayout;
  setSearchQuery: (q: string) => void;
  setSortBy: (s: SortOption) => void;
  setLayout: (l: ViewLayout) => void;
  createNote: (data: NoteFormData) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  togglePin: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  refreshNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {

  const { token } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [layout, setLayout] = useState<ViewLayout>("grid");

  const refreshNotes = useCallback(async () => {

    if (!token) return;

    try {

      const res = await fetch(`${API}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      setNotes(data);

    } catch (e) {
      console.log("NOTES FETCH ERROR", e);
    }

  }, [token]);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const createNote = async (data: NoteFormData) => {

    if (!token) return;

    try {

      await fetch(`${API}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      await refreshNotes();   // 🔥 IMPORTANT

    } catch (e) {
      console.log("CREATE NOTE ERROR", e);
    }
  };

  const deleteNote = async (id: number) => {

    if (!token) return;

    try {

      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await refreshNotes();   // 🔥 IMPORTANT

    } catch (e) {
      console.log("DELETE NOTE ERROR", e);
    }
  };

  const togglePin = async (id: number) => {

    const note = notes.find((n) => n.id === id);
    if (!note || !token) return;

    try {

      await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          pinned: !note.pinned,
          favorite: note.favorite,
        }),
      });

      await refreshNotes();   // 🔥 IMPORTANT

    } catch (e) {
      console.log("PIN NOTE ERROR", e);
    }
  };

  const toggleFavorite = async (id: number) => {

    const note = notes.find((n) => n.id === id);
    if (!note || !token) return;

    try {

      await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          pinned: note.pinned,
          favorite: !note.favorite,
        }),
      });

      await refreshNotes();   // 🔥 IMPORTANT

    } catch (e) {
      console.log("FAV NOTE ERROR", e);
    }
  };

  const filteredNotes = notes
    .filter(
      (n) =>
        n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === "newest"
        ? new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
    );

  return (
    <NotesContext.Provider
      value={{
        notes,
        filteredNotes,
        searchQuery,
        sortBy,
        layout,
        setSearchQuery,
        setSortBy,
        setLayout,
        createNote,
        deleteNote,
        togglePin,
        toggleFavorite,
        refreshNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx)
    throw new Error("useNotes must be used within NotesProvider");
  return ctx;
}