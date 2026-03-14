"use client";

import React, { useState } from "react";
import { User, Moon, Sun, Trash2, Loader2, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useNotes } from "@/context/NotesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/useToast";
import { getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--muted-foreground)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 14,
        }}
      >
        {title}
      </h2>
      <div className="glass-card" style={{ overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

function SettingRow({
  label,
  description,
  action,
}: {
  label: string;
  description?: string;
  action: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "14px 18px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div>
        <p style={{ fontSize: 13.5, fontWeight: 500, color: "var(--foreground)" }}>
          {label}
        </p>
        {description && (
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useSettings();
  const { notes } = useNotes();
  const router = useRouter();

  const [name, setName] = useState(user?.name ?? "");
  const [nameSaved, setNameSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveName = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    setNameSaved(true);
    toast({ title: "Profile updated", variant: "success" });
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 620, margin: "0 auto", padding: "28px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24 }}>Settings</h1>
        <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
          Manage your account and preferences.
        </p>
      </div>

      <Section title="Profile">
        <div style={{ padding: 18, display: "flex", gap: 14 }}>
          <Avatar style={{ width: 48, height: 48 }}>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{getInitials(user?.name ?? "U")}</AvatarFallback>
          </Avatar>

          <div>
            <p>{user?.name}</p>
            <p style={{ fontSize: 12 }}>{user?.email}</p>
          </div>
        </div>

        <div style={{ padding: 18 }}>
          <Label>Name</Label>
          <div style={{ display: "flex", gap: 8 }}>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <Button onClick={handleSaveName} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" size={14} /> : nameSaved ? <Check size={14} /> : null}
              Save
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Appearance">
        <SettingRow
          label="Dark Mode"
          description={`Current: ${theme}`}
          action={
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          }
        />
      </Section>

      <Section title="Account">
        <div style={{ padding: 18 }}>
          <Button variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </Section>

      <p style={{ fontSize: 12, textAlign: "center", marginTop: 10 }}>
        Total Notes: {notes.length}
      </p>
    </div>
  );
}