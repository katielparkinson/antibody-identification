import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Antibody Identification",
  description: "Quick start and full guide for classic blood bank antibody identification panels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <header className="site-header">
          <Link className="brand" href="/">
            Antibody Identification
          </Link>
          <nav aria-label="Primary navigation">
            <Link href="/">Quick Start</Link>
            <Link href="/guide">Full Guide</Link>
            <Link href="/practice">Practice</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
