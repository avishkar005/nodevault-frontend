import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "NoteVault — Your Personal Knowledge Base",
  description: "Save, organize, and retrieve your important notes, messages, and links.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <SettingsProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
