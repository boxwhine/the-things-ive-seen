import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

import Nav from "../components/nav";
import Providers from "./providers";
import {isDev} from '../utils';

// Adds messages only in a dev environment
if (isDev()) {
  loadDevMessages();
  loadErrorMessages();
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Things I've Seen",
  description: "An event visualization app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <header>
            <Nav />
          </header>

          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
