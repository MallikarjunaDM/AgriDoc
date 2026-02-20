import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { UserProfileProvider } from "@/context/UserProfileContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgriDoc - Agriculture Doctor",
  description: "AI-powered crop disease detection and farming assistant for Indian farmers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Slapa — Headers */}
        <link
          rel="stylesheet"
          media="screen"
          href="https://fontlibrary.org//face/slapa"
          type="text/css"
        />
        {/* KH Kangrey — Body text */}
        <link
          rel="stylesheet"
          media="screen"
          href="https://fontlibrary.org//face/kh-kangrey"
          type="text/css"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <UserProfileProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </UserProfileProvider>
      </body>
    </html>
  );
}
