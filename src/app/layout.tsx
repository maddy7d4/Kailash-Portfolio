import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Cursor } from "@/components/ui/cursor";
import { Grain } from "@/components/ui/grain";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { DockWrapper } from "@/components/layout/dock-wrapper";
import { SoundProvider } from "@/context/sound-context";
import { Preloader } from "@/components/ui/preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kailas - Video Editor",
  description: "Portfolio of Kailas, a top-class video editor from India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SoundProvider>
            <Preloader />
            <SmoothScroll>
              <Cursor />
              <Grain />
              <Header />
              {children}
              <DockWrapper />
            </SmoothScroll>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
