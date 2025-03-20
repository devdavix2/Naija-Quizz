import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import { Analytics } from "@/components/analytics"
import { OfflineIndicator } from "@/components/offline-indicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NaijaSpark Quiz",
  description: "Discover the vibrant culture of Nigeria through fun, interactive quizzes",
  openGraph: {
    title: "NaijaSpark Quiz",
    description: "Discover the vibrant culture of Nigeria through fun, interactive quizzes",
    url: "https://naija-quizz.vercel.app/",
    siteName: "NaijaSpark Quiz",
    images: [
      {
        // Using a dynamic OG image endpoint to generate the thumbnail card
        url: "https://naija-quizz.vercel.app/api/og?title=NaijaSpark%20Quiz",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NaijaSpark Quiz",
    description: "Discover the vibrant culture of Nigeria through fun, interactive quizzes",
    images: ["https://naija-quizz.vercel.app/api/og?title=NaijaSpark%20Quiz"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <Navbar />
          <div className="min-h-screen max-w-full overflow-x-hidden">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 break-words">
              {children}
            </main>
          </div>
          <OfflineIndicator />
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
