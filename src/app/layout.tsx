import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import TabNav from "@/components/layout/TabNav"
import QueryProvider from "@/providers/QueryProvider"
import ThemeProvider from "@/providers/ThemeProvider"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata: Metadata = {
  title: "주식공부 — 반도체 주식 & 용어 사전",
  description: "비전공자를 위한 국내 반도체 주식 대시보드와 주식 용어 학습 앱",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200">
        <ThemeProvider>
          <QueryProvider>
            <Header />
            <TabNav />
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
              {children}
            </main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
