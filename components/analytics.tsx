"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Skip during development
    if (process.env.NODE_ENV === "development") return

    // Track page views
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

    // Check if gtag is available (Google Analytics)
    if (typeof window !== "undefined" && "gtag" in window) {
      // @ts-ignore
      window.gtag("config", "G-XXXXXXXXXX", {
        page_path: url,
      })
    }
  }, [pathname, searchParams])

  return null
}

