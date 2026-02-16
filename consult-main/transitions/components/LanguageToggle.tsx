"use client";

import { useState } from "react";

export function LanguageToggle({
  en,
  sw,
  defaultLang = "en"
}: {
  en: string;
  sw: string;
  defaultLang?: "en" | "sw";
}) {
  const [lang, setLang] = useState<"en" | "sw">(defaultLang);
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            lang === "en" ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
          }`}
          onClick={() => setLang("en")}
        >
          English
        </button>
        <button
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            lang === "sw" ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
          }`}
          onClick={() => setLang("sw")}
        >
          Kiswahili
        </button>
      </div>
      <p className="text-sm text-slate-700 whitespace-pre-line">{lang === "en" ? en : sw}</p>
    </div>
  );
}
