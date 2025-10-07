import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import { Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-headline" });
const sourceCodePro = Source_Code_Pro({ subsets: ["latin"], variable: "--font-code" });

export const metadata: Metadata = {
  title: "CodeStudio",
  description: "A social platform for developers to share code snippets and collaborate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, spaceGrotesk.variable, sourceCodePro.variable, "font-sans")}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
