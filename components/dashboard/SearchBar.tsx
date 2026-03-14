"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search notes…" }: SearchBarProps) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Search
        size={14}
        style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--muted-foreground)",
          pointerEvents: "none",
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: 36,
          paddingLeft: 34,
          paddingRight: value ? 34 : 12,
          paddingTop: 0,
          paddingBottom: 0,
          background: "var(--secondary)",
          border: "1px solid transparent",
          borderRadius: 8,
          color: "var(--foreground)",
          fontSize: 13.5,
          fontFamily: "var(--font-geist-sans)",
          outline: "none",
          transition: "border-color 0.15s, background 0.15s",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.background = "var(--card)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "transparent";
          e.currentTarget.style.background = "var(--secondary)";
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--muted-foreground)",
            display: "flex",
            padding: 2,
            borderRadius: 4,
          }}
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
