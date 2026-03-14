"use client";

import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean } = {}
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { ctrlKey = false, metaKey = false, shiftKey = false } = options;
      const mod = ctrlKey || metaKey;
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        (mod ? e.ctrlKey || e.metaKey : true) &&
        (!shiftKey || e.shiftKey)
      ) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, options]);
}
