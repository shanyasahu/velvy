import type { Metadata } from "next";
import "./globals.css";
import { Cormorant_Garamond, Dancing_Script, Poppins } from "next/font/google";
import { Providers } from "./providers";
import { VelvyHeader } from "./components/header/VelvyHeader";
import { VelvyBottomNav } from "./components/navigation/VelvyBottomNav";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

const bodyFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

const logoFont = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-logo",
});

export const metadata: Metadata = {
  title: "Velvy | Find Your Expert",
  description:
    "Browse and book verified beauty, wellness, and grooming experts near you.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} ${logoFont.variable} bg-(--bg-primary) min-h-screen antialiased`}
      >
        <Providers>
          <VelvyHeader />
          {children}
          <VelvyBottomNav />
        </Providers>
      </body>
    </html>
  );
}
