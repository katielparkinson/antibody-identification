import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Antibody Identification",
  description: "Practice classic blood bank antibody identification panels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/">
            Antibody Identification
          </Link>
          <nav aria-label="Primary navigation">
            <Link href="/">Learn</Link>
            <Link href="/practice">Practice</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
