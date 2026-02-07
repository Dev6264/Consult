import "./globals.css";
import type { ReactNode } from "react";
import { Sidebar } from "../components/sidebar";

export const metadata = {
  title: "SteeringOS",
  description: "Steer multi-tenant commerce with one dashboard."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 bg-slate-950 px-8 py-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
