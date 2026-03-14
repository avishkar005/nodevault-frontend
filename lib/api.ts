const BASE_URL = "http://localhost:8080/api";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API Error");
  }

  return res.json();
}

/* ================= AUTH ================= */

export const loginApi = (data: { email: string; password: string }) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const registerApi = (data: {
  name: string;
  email: string;
  password: string;
}) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

/* ================= NOTES ================= */

export const getNotesApi = () => request("/notes");

export const createNoteApi = (data: any) =>
  request("/notes", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateNoteApi = (id: number, data: any) =>
  request(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteNoteApi = (id: number) =>
  request(`/notes/${id}`, {
    method: "DELETE",
  });