# NoteVault

A professional notes web application built with Next.js 15, React, TypeScript, and Tailwind CSS.

## Features

- **Authentication** — Email/password login & register with Google Sign-in (mock, ready for Spring Boot backend)
- **Dashboard** — Stats overview, recent notes, quick create
- **All Notes** — Full notes list with search, sort, grid/list layout
- **Pinned Notes** — Quick access to pinned notes
- **Favorites** — Your starred notes
- **Note Detail** — Full note view with copy, pin, favorite, edit, delete
- **Note Editor** — Create/edit with title, content, tags, image upload
- **Settings** — Profile update, dark/light mode toggle, data management
- **Keyboard Shortcut** — Press `Ctrl+N` to open new note editor from anywhere
- **Local Storage** — All notes & settings persist in browser localStorage
- **Dark Mode** — Full dark/light theme support
- **Mobile Responsive** — Works on all screen sizes

## Tech Stack

- **Next.js 15** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Radix UI** primitives (Dialog, Dropdown, Switch, Avatar, Toast)
- **React Hook Form + Zod** validation
- **DM Sans + DM Serif Display** fonts

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
npm start
```

## Demo Login

Use any email + password (min 6 chars) to log in. Demo notes are auto-seeded on first login.

Or click **Continue with Google** (mocked — creates a demo user).

---

## Adding Google Authentication (Firebase — when ready)

1. Go to [Firebase Console](https://console.firebase.google.com) → Create project
2. Enable **Authentication → Google** provider
3. Add your domain to authorized domains
4. Install Firebase:

```bash
npm install firebase
```

5. Create `lib/firebase.ts`:

```ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ...
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

6. Replace `loginWithGoogle` in `context/AuthContext.tsx` with:

```ts
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  // send result.user.idToken to Spring Boot backend
};
```

---

## Connecting to Spring Boot Backend

Replace the functions in `lib/localStorage.ts` with API calls:

```ts
// Example:
export async function getNotes(): Promise<Note[]> {
  const res = await fetch("/api/notes", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
}
```

The `AuthContext.tsx` login/register functions are already structured to accept token responses — just replace the mock delays with real `fetch` calls to your Spring Boot endpoints.

---

## Project Structure

```
nodevault/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (dashboard)/
│       ├── dashboard/page.tsx
│       ├── notes/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── pinned/page.tsx
│       ├── favorites/page.tsx
│       └── settings/page.tsx
├── components/
│   ├── auth/AuthForm.tsx
│   ├── dashboard/Sidebar.tsx, SearchBar.tsx
│   ├── notes/NoteCard.tsx, NoteEditor.tsx, NotesGrid.tsx, UploadImage.tsx
│   ├── shared/PageHeader.tsx
│   └── ui/ (Button, Input, Textarea, Dialog, DropdownMenu, Switch, Avatar, Badge, Toast...)
├── context/
│   ├── AuthContext.tsx
│   ├── NotesContext.tsx
│   └── SettingsContext.tsx
├── hooks/
│   ├── useKeyboardShortcut.ts
│   └── useToast.ts
├── lib/
│   ├── utils.ts
│   └── localStorage.ts
└── types/index.ts
```
