"use client"

import { Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileQuestion } from "lucide-react"

// Separate component that uses useSearchParams
function NotFoundContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FileQuestion className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/")} className="bg-green-600 hover:bg-green-700">
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  )
}