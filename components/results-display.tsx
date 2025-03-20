"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, Home, Trophy, Twitter, Facebook, Send, Share2, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Quiz } from "@/types/app-types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/lib/store"
import confetti from "canvas-confetti"
import { motion, AnimatePresence } from "framer-motion"

interface ResultsDisplayProps {
  quiz: Quiz
  score: number
  total: number
  percentage: number
  language: string
}

export default function ResultsDisplay({ quiz, score, total, percentage, language }: ResultsDisplayProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("results")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  // Get user badges from store
  const badges = useStore((state) => state.badges)

  // Render the share card when component mounts
  useEffect(() => {
    setShowCelebration(true)

    // Trigger confetti
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
    })

    // Render the share card initially
    renderShareCard()

    // Track result view in analytics
    if (typeof window !== "undefined" && "gtag" in window) {
      // @ts-ignore
      window.gtag("event", "view_results", {
        quiz_id: quiz.id,
        quiz_title: quiz.title,
        score: score,
        total: total,
        percentage: percentage,
      })
    }
  }, [quiz.id, quiz.title, score, total, percentage])

  // When user switches to the "share" tab, delay re-rendering the canvas
  useEffect(() => {
    if (activeTab === "share") {
      setTimeout(() => {
        renderShareCard()
      }, 100)
    }
  }, [activeTab])

  // Determine badge based on score percentage
  const getBadge = () => {
    if (percentage >= 90) return "Naija Expert"
    if (percentage >= 70) return "Naija Pro"
    if (percentage >= 50) return "Naija Enthusiast"
    return "Naija Novice"
  }

  const badge = getBadge()

  // Get message based on score
  const getMessage = () => {
    if (percentage >= 90) return "Incredible! You're a true Nigerian culture expert!"
    if (percentage >= 70) return "Great job! You know your Nigerian culture well!"
    if (percentage >= 50) return "Not bad! You have a good grasp of Nigerian culture."
    return "Keep learning! There's more to discover about Nigerian culture."
  }

  const message = getMessage()

  // Helper function to draw a rounded rectangle
  const drawRoundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number | { tl: number; tr: number; br: number; bl: number }
  ) => {
    if (typeof radius === "number") {
      radius = { tl: radius, tr: radius, br: radius, bl: radius }
    }
    ctx.beginPath()
    ctx.moveTo(x + radius.tl, y)
    ctx.lineTo(x + width - radius.tr, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
    ctx.lineTo(x + width, y + height - radius.br)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
    ctx.lineTo(x + radius.bl, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
    ctx.lineTo(x, y + radius.tl)
    ctx.quadraticCurveTo(x, y, x + radius.tl, y)
    ctx.closePath()
  }

  // Render share card to canvas with increased dimensions
  const renderShareCard = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 700
    canvas.height = 400

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, "#22c55e")
    gradient.addColorStop(1, "#15803d")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw white card background using the helper for rounded rectangle
    ctx.fillStyle = "#ffffff"
    drawRoundRect(ctx, 30, 30, canvas.width - 60, canvas.height - 60, 10)
    ctx.fill()

    // Draw quiz title
    ctx.fillStyle = "#000000"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText(quiz.title, canvas.width / 2, 80)

    // Draw score
    ctx.font = "bold 48px Arial"
    ctx.fillText(`${score}/${total}`, canvas.width / 2, 160)

    // Draw percentage
    ctx.font = "24px Arial"
    ctx.fillText(`${percentage}% Correct`, canvas.width / 2, 210)

    // Draw badge background using the helper function
    ctx.fillStyle = "#22c55e"
    drawRoundRect(ctx, canvas.width / 2 - 100, 230, 200, 40, 20)
    ctx.fill()

    // Draw badge text
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 20px Arial"
    ctx.fillText(badge, canvas.width / 2, 257)

    // Draw message
    ctx.fillStyle = "#000000"
    ctx.font = "18px Arial"
    ctx.fillText(message, canvas.width / 2, 300)

    // Draw branding text only (no icon) and bring it down a little.
    ctx.fillStyle = "#000000"
    ctx.font = "bold 20px Arial"
    ctx.textAlign = "center"
    ctx.fillText("NaijaSpark Quiz", canvas.width / 2, 350)
  }

  // Share functions
  const shareOnTwitter = () => {
    const url = window.location.href
    const text = `I scored ${score}/${total} (${percentage}%) on the ${quiz.title} quiz and earned the "${badge}" badge! Try NaijaSpark Quiz yourself at ${url}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank")
  }

  const shareOnFacebook = () => {
    const url = window.location.href
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
  }

  const shareOnWhatsApp = () => {
    const url = window.location.href
    const text = `I scored ${score}/${total} (${percentage}%) on the ${quiz.title} quiz and earned the "${badge}" badge! Try NaijaSpark Quiz yourself at ${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
  }

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadShareImage = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `naijaspark-quiz-${quiz.id}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
    toast({
      title: "Image downloaded!",
      description: "Share your results with friends",
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="max-w-3xl mx-auto overflow-hidden">
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="bg-gradient-to-r from-green-500 to-green-700 p-8 text-white text-center relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-white opacity-10 rounded-full scale-0 animate-ping" />
              </motion.div>

              <motion.div
                className="mb-4 flex justify-center relative z-10"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {percentage >= 70 ? <Trophy className="h-16 w-16" /> : <Award className="h-16 w-16" />}
              </motion.div>

              <motion.h1
                className="text-3xl font-bold mb-2 relative z-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Quiz Completed!
              </motion.h1>

              <motion.p
                className="text-xl relative z-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {quiz.title}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs defaultValue="results" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="p-0">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Your Results</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 overflow-x-auto">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {score}/{total}
                </div>
                <Progress value={percentage} className="h-4" />
                <p className="mt-2 text-gray-600 dark:text-gray-300">{percentage}% Correct</p>
              </motion.div>

              <motion.div
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Badge className="mb-2 bg-green-600">{badge}</Badge>
                <p className="break-words">{message}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h3 className="font-medium mb-2">Achievement:</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                    {badge}
                  </Badge>
                </div>
              </motion.div>

              <Separator />

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="font-medium">Try these quizzes next:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {quiz.relatedQuizzes?.slice(0, 2).map((relatedQuiz) => (
                    <Button
                      key={relatedQuiz.id}
                      variant="outline"
                      className="justify-start"
                      onClick={() => router.push(`/quiz/${relatedQuiz.id}`)}
                    >
                      {relatedQuiz.title}
                    </Button>
                  ))}
                </div>
              </motion.div>
            </CardContent>
          </TabsContent>

          <TabsContent value="share" className="p-0">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Share Your Results</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="relative">
                <canvas ref={canvasRef} className="w-full h-auto rounded-lg shadow-md" />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-white dark:bg-gray-800 opacity-80 hover:opacity-100"
                  onClick={downloadShareImage}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <h3 className="font-medium mb-4">Share on social media:</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="flex items-center gap-2" onClick={shareOnTwitter}>
                    <Twitter className="h-5 w-5" />
                    <span>Twitter</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2" onClick={shareOnFacebook}>
                    <Facebook className="h-5 w-5" />
                    <span>Facebook</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2" onClick={shareOnWhatsApp}>
                    <Send className="h-5 w-5" />
                    <span>WhatsApp</span>
                  </Button>
                </div>
              </div>

              <div>
                <Button variant="outline" className="w-full flex items-center gap-2" onClick={copyShareLink}>
                  <Share2 className="h-5 w-5" />
                  <span>Copy Share Link</span>
                </Button>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>

        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={() => router.push("/")}>
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

