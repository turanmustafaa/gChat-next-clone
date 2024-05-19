import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "G-chat",
  description: "Call app",
  icons: {
    icon: "/icons/logo.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider appearance={{
        layout : {
          logoImageUrl : '/icons/Video.svg'
        }
      }
      }>
      <body className={`${inter.className} bg-dark-2`}>
        {children}
        <Toaster />
        </body>
      </ClerkProvider>
    </html>
  );
}
