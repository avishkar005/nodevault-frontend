"use client";

import React from "react";
import { LayoutGrid, List, SortDesc } from "lucide-react";
import { SortOption, ViewLayout } from "@/types";
import { SearchBar } from "@/components/dashboard/SearchBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  layout: ViewLayout;
  onLayoutChange: (l: ViewLayout) => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  action?: React.ReactNode;
}

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  "title-asc": "Title A→Z",
  "title-desc": "Title Z→A",
};

export function PageHeader({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  layout,
  onLayoutChange,
  sortBy,
  onSortChange,
  action,
}: PageHeaderProps) {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "20px 28px 16px",
        background: "var(--background)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 400,
              color: "var(--foreground)",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 3 }}>{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, maxWidth: 360 }}>
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" style={{ gap: 5, fontSize: 12.5, height: 32 }}>
              <SortDesc size={13} />
              <span className="hidden sm:inline">{SORT_LABELS[sortBy]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => onSortChange(opt)}
                style={{ fontWeight: sortBy === opt ? 500 : 400 }}
              >
                {sortBy === opt && <span style={{ marginRight: 4, color: "var(--brand)" }}>✓</span>}
                {SORT_LABELS[opt]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Layout toggle */}
        <div
          style={{
            display: "flex",
            border: "1px solid var(--border)",
            borderRadius: 7,
            overflow: "hidden",
          }}
        >
          {(["grid", "list"] as ViewLayout[]).map((l) => (
            <button
              key={l}
              onClick={() => onLayoutChange(l)}
              style={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: layout === l ? "var(--secondary)" : "transparent",
                border: "none",
                cursor: "pointer",
                color: layout === l ? "var(--foreground)" : "var(--muted-foreground)",
                transition: "all 0.12s",
              }}
            >
              {l === "grid" ? <LayoutGrid size={13} /> : <List size={13} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
