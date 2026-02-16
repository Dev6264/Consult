import { ReactNode } from "react";
import clsx from "clsx";

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "warning" | "success" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        tone === "default" && "bg-slate-100 text-slate-700",
        tone === "warning" && "bg-red-100 text-red-700",
        tone === "success" && "bg-emerald-100 text-emerald-700"
      )}
    >
      {children}
    </span>
  );
}
