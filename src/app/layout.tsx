import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

// Подключаем шрифт Inter для премиального интерфейса
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Aether OS — Интеллектуальное рабочее пространство",
  description: "Премиальное ИИ-пространство для управления проектами и автоматизации",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="ru" className="dark" style={{ colorScheme: "dark" }}>
        <body
          className={`${inter.variable} font-sans antialiased bg-zinc-950 text-zinc-50 min-h-screen`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}