"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return

    // Get query string directly from window.location
    const search = typeof window !== "undefined" ? window.location.search : ""
    const url = pathname + search

    if (typeof window !== "undefined" && "gtag" in window) {
      // @ts-ignore
      window.gtag("config", "G-XXXXXXXXXX", {
        page_path: url,
      })
    }
  }, [pathname])

  return null
}

export default Analytics
