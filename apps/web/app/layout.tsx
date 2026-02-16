import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Verified Obituary Commerce Kenya' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b">
          <div className="max-w-6xl mx-auto p-4 flex gap-4">
            <Link href="/" className="font-bold">Verified Obituary</Link>
            <Link href="/create">Create Notice</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
