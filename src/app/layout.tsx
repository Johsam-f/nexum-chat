import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexum Chat",
  description: "a realtime chat app, join in seconds.",
  icons: {
    icon: "/nexum-chat.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(geistSans.variable, geistMono.variable, "antialiased")}>
        <ThemeProvider>
          <div className="min-h-screen relative">
            <Toaster position="top-center" />
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
