export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  token?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface NoteImage {
  id: string;
  url: string;
  name: string;
  size: number;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  images?: NoteImage[];

  pinned: boolean;        // ✅ FIXED
  favorite: boolean;      // ✅ FIXED

  createdAt: string;
  updatedAt?: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  tags: string[];

  pinned: boolean;        // ✅ FIXED
  favorite: boolean;      // ✅ FIXED
}

export type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";
export type ViewLayout = "grid" | "list";
export type Theme = "light" | "dark";

export interface AppSettings {
  theme: Theme;
  layout: ViewLayout;
  sortBy: SortOption;
}

export interface AuthResponse {
  token: string;
  user: User;
}