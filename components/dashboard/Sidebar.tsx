"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Pin,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotes } from "@/context/NotesContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "All Notes", href: "/notes", icon: FileText },
  { label: "Pinned", href: "/pinned", icon: Pin },
  { label: "Favorites", href: "/favorites", icon: Heart },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { notes } = useNotes();

  const counts = {
    "/notes": notes.length,
    "/pinned": notes.filter((n) => n.pinned).length,
    "/favorites": notes.filter((n) => n.favorite).length,
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "20px 0",
        background: "var(--sidebar)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 20px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              background: "var(--foreground)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "var(--background)", fontSize: 14, fontFamily: "var(--font-display)" }}>N</span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
            NoteVault
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: 4 }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          const count = counts[href as keyof typeof counts];
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "8px 10px",
                borderRadius: 7,
                textDecoration: "none",
                fontSize: 13.5,
                fontWeight: active ? 500 : 400,
                color: active ? "var(--foreground)" : "var(--muted-foreground)",
                background: active ? "var(--secondary)" : "transparent",
                transition: "all 0.12s",
              }}
            >
              <Icon size={15} />
              <span style={{ flex: 1 }}>{label}</span>
              {count !== undefined && count > 0 && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: active ? "var(--foreground)" : "var(--muted-foreground)",
                    background: active ? "var(--border)" : "transparent",
                    padding: "1px 6px",
                    borderRadius: 999,
                    minWidth: 20,
                    textAlign: "center",
                  }}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}

        <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />

        <Link
          href="/settings"
          onClick={onClose}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "8px 10px",
            borderRadius: 7,
            textDecoration: "none",
            fontSize: 13.5,
            fontWeight: pathname === "/settings" ? 500 : 400,
            color: pathname === "/settings" ? "var(--foreground)" : "var(--muted-foreground)",
            background: pathname === "/settings" ? "var(--secondary)" : "transparent",
            transition: "all 0.12s",
          }}
        >
          <Settings size={15} />
          <span>Settings</span>
        </Link>
      </nav>

      {/* User */}
      <div style={{ padding: "14px 10px 0", borderTop: "1px solid var(--border)", marginTop: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "8px 10px",
            borderRadius: 7,
          }}
        >
          <Avatar style={{ width: 30, height: 30 }}>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback style={{ fontSize: 11 }}>{getInitials(user?.name || "U")}</AvatarFallback>
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12.5, fontWeight: 500, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name}
            </p>
            <p style={{ fontSize: 11, color: "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "8px 10px",
            borderRadius: 7,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13.5,
            color: "var(--muted-foreground)",
            transition: "all 0.12s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--destructive)";
            (e.currentTarget as HTMLButtonElement).style.background = "var(--secondary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
            (e.currentTarget as HTMLButtonElement).style.background = "none";
          }}
        >
          <LogOut size={15} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-[220px] flex-shrink-0" style={{ height: "100vh" }}>
        <SidebarContent />
      </div>

      {/* Mobile toggle */}
      <button
        className="lg:hidden"
        onClick={() => setMobileOpen(true)}
        style={{
          position: "fixed",
          top: 14,
          left: 14,
          zIndex: 50,
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "var(--card)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        <Menu size={16} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "rgba(0,0,0,0.4)",
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            style={{ width: 240, height: "100%", position: "absolute", left: 0, top: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
