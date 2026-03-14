"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-4 right-4 z-[100] flex max-h-screen w-full max-w-[340px] flex-col gap-2",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & { variant?: "default" | "success" | "destructive" }
>(({ className, variant = "default", ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(
      "group pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg border p-3 pr-8 shadow-lg transition-all animate-slide-in",
      variant === "default" && "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]",
      variant === "success" && "bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-foreground)]",
      variant === "destructive" && "bg-[var(--destructive)] border-[var(--destructive)] text-[var(--destructive-foreground)]",
      className
    )}
    {...props}
  />
));
Toast.displayName = ToastPrimitive.Root.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn("absolute right-2 top-2 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity", className)}
    {...props}
  >
    <X size={13} />
  </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn("text-sm font-medium", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description ref={ref} className={cn("text-xs opacity-80", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

// Simple hook
type ToastType = { id: string; title: string; description?: string; variant?: "default" | "success" | "destructive" };
const toastListeners: Array<(toasts: ToastType[]) => void> = [];
let toastList: ToastType[] = [];

function emitToasts() {
  toastListeners.forEach((l) => l([...toastList]));
}

export function toast(opts: Omit<ToastType, "id">) {
  const id = Math.random().toString(36).slice(2);
  toastList = [{ ...opts, id }, ...toastList].slice(0, 5);
  emitToasts();
  setTimeout(() => {
    toastList = toastList.filter((t) => t.id !== id);
    emitToasts();
  }, 3500);
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastType[]>([]);

  React.useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      const idx = toastListeners.indexOf(setToasts);
      if (idx > -1) toastListeners.splice(idx, 1);
    };
  }, []);

  return (
    <ToastProvider>
      {toasts.map((t) => (
        <Toast key={t.id} variant={t.variant}>
          <div>
            <ToastTitle>{t.title}</ToastTitle>
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
