import "../styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Transitions",
  description: "WhatsApp-first digital obituary platform for Kenya"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <div>
              <p className="text-lg font-semibold">Transitions</p>
              <p className="text-xs text-slate-500">Dignified obituaries, Kenya</p>
            </div>
            <div className="flex gap-3 text-sm text-slate-600">
              <a href="/organizer" className="hover:text-slate-900">Organizer Intake</a>
              <a href="/admin" className="hover:text-slate-900">Admin Console</a>
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
