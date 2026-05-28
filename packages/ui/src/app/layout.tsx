import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Providers from "./providers";
import Nav from "@/components/nav";

export const metadata: Metadata = {
  title: "The Things I've Seen",
  description: "Concert and event tracking and visualization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen`}>
        <Providers>
          <header className="border-b px-6 py-3">
            <Nav />
          </header>
          <main className="px-6 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
