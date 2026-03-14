const KEYS = {
  TOKEN: "nodevault_token",
  USER: "nodevault_user",
  SETTINGS: "nodevault_settings",
};

/* ================= TOKEN ================= */

export function saveToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.TOKEN, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.TOKEN);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.TOKEN);
}

/* ================= USER ================= */

export function saveUser(user: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export function getUser(): any | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEYS.USER);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.USER);
}

/* ================= SETTINGS ================= */

export function getSettings() {
  if (typeof window === "undefined") {
    return {
      theme: "light",
      layout: "grid",
      sortBy: "newest",
    };
  }

  const raw = localStorage.getItem(KEYS.SETTINGS);

  if (!raw) {
    return {
      theme: "light",
      layout: "grid",
      sortBy: "newest",
    };
  }

  try {
    return JSON.parse(raw);
  } catch {
    return {
      theme: "light",
      layout: "grid",
      sortBy: "newest",
    };
  }
}

export function saveSettings(settings: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}