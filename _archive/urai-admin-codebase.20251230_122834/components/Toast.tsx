"use client";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

type ToastKind = "success" | "error" | "info";
export type ToastOpts = { description?: string; durationMs?: number };

type ToastMsg = { id: string; title: string; kind: ToastKind; description?: string; until: number };

const ToastCtx = createContext<{
  success: (title: string, opts?: ToastOpts) => void;
  error: (title: string, opts?: ToastOpts) => void;
  info: (title: string, opts?: ToastOpts) => void;
}>({ success: () => {}, error: () => {}, info: () => {} });

export function Toaster() {
  const [items, setItems] = useState<ToastMsg[]>([]);
  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now();
      setItems((prev) => prev.filter((i) => i.until > now));
    }, 250);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] grid gap-2">
      {items.map((t) => (
        <div key={t.id} className={`min-w-[260px] max-w-[340px] rounded-xl border p-3 shadow-lg bg-slate-900/95 ${ 
          t.kind === "success" ? "border-emerald-600" : t.kind === "error" ? "border-red-600" : "border-slate-600"
        }`}>
          <div className="text-sm font-medium">{t.title}</div>
          {t.description && <div className="text-xs text-slate-300 mt-1">{t.description}</div>}
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [, setQ] = useState<ToastMsg[]>([]);
  const add = (kind: ToastKind) => (title: string, opts?: ToastOpts) => {
    const id = Math.random().toString(36).slice(2);
    const duration = opts?.durationMs ?? 3500;
    const until = Date.now() + duration;
    setQ((q) => [...q, { id, title, kind, description: opts?.description, until }]);
  };

  // simple bridge via event on window to communicate with <Toaster/>
  const api = useMemo(() => ({
    success: add("success"),
    error: add("error"),
    info: add("info"),
  }), []);

  // Wire to Toaster via custom event
  const ref = useRef(api);
  useEffect(() => { ref.current = api; }, [api]);
  useEffect(() => {
    const handler = (e: any) => {
      const msg = e.detail as ToastMsg;
      const el = document.querySelector("#urai_toaster_hook");
      if (!el) return;
    };
    window.addEventListener("urai_toast", handler as any);
    return () => window.removeEventListener("urai_toast", handler as any);
  }, []);

  // local Toaster instance for this hook
  const [items, setItems] = useState<ToastMsg[]>([]);
  useEffect(() => {
    const i = setInterval(() => setItems((prev) => prev.filter((t) => t.until > Date.now())), 250);
    return () => clearInterval(i);
  }, []);

  // render a hidden toaster tied to this hook
  return {
    ...api,
    _items: items,
  } as any;
}
