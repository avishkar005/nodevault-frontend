"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pin, Heart, Loader2 } from "lucide-react";
import { Note, NoteFormData } from "@/types";
import { useNotes } from "@/context/NotesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/useToast";
import { useAuth } from "@/context/AuthContext";

const API = "http://localhost:8080/api/notes";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  content: z.string().min(1, "Content is required"),
});

type FormData = z.infer<typeof schema>;

interface NoteEditorProps {
  open: boolean;
  onClose: () => void;
  note?: Note;
  mode?: "create" | "edit";
}

export function NoteEditor({
  open,
  onClose,
  note,
  mode = "create",
}: NoteEditorProps) {

  const { createNote, refreshNotes } = useNotes();
  const { token } = useAuth();

  const [pinned, setpinned] = useState(false);
  const [favorite, setfavorite] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {

    if (!open) return;

    if (note) {
      reset({ title: note.title, content: note.content });
      setpinned(note.pinned);
      setfavorite(note.favorite);
    } else {
      reset({ title: "", content: "" });
      setpinned(false);
      setfavorite(false);
    }

  }, [open, note, reset]);

  const onSubmit = async (data: FormData) => {

    const payload: NoteFormData = {
      title: data.title,
      content: data.content,
      pinned: pinned,
      favorite: favorite,
      tags: [],
    };

    try {

      if (mode === "edit" && note && token) {

        await fetch(`${API}/${note.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        toast({ title: "Note updated", variant: "success" });

      } else {

        await createNote(payload);
        toast({ title: "Note created", variant: "success" });

      }

      await refreshNotes();   // 🔥 VERY IMPORTANT
      onClose();

    } catch {
      toast({ title: "Action failed", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent style={{ maxWidth: 600 }}>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Note" : "New Note"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          <div>
            <Label>Title</Label>
            <Input {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label>Content</Label>
            <Textarea style={{ minHeight: 160 }} {...register("content")} />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant={pinned ? "default" : "outline"}
              size="sm"
              onClick={() => setpinned(!pinned)}
            >
              <Pin size={14} /> {pinned ? "Pinned" : "Pin"}
            </Button>

            <Button
              type="button"
              variant={favorite ? "default" : "outline"}
              size="sm"
              onClick={() => setfavorite(!favorite)}
            >
              <Heart size={14} /> {favorite ? "Favorited" : "Favorite"}
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="animate-spin mr-2" size={14} />
              )}
              {mode === "edit" ? "Update" : "Create"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}