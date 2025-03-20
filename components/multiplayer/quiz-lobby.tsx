"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Play, Copy, Crown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface Player {
  id: string
  name: string
  avatar?: string
  ready: boolean
  isHost: boolean
}

export default function QuizLobby() {
  const { toast } = useToast()
  const router = useRouter()
  const [roomCode, setRoomCode] = useState("NAIJA123")
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "You", ready: true, isHost: true },
    { id: "2", name: "Chidi", avatar: "/avatars/chidi.png", ready: false, isHost: false },
    { id: "3", name: "Amaka", avatar: "/avatars/amaka.png", ready: true, isHost: false },
  ])
  const [isReady, setIsReady] = useState(true)
  const [countdown, setCountdown] = useState<number | null>(null)

  // Simulate players joining
  useEffect(() => {
    const timer = setTimeout(() => {
      if (players.length < 5) {
        setPlayers((prev) => [
          ...prev,
          {
            id: `${prev.length + 1}`,
            name: ["Ngozi", "Emeka", "Chioma", "Oluwaseun"][players.length - 3],
            avatar: `/avatars/avatar${players.length}.png`,
            ready: false,
            isHost: false,
          },
        ])
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [players])

  // Simulate players getting ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setPlayers((prev) =>
        prev.map((player) => (!player.ready && Math.random() > 0.5 ? { ...player, ready: true } : player)),
      )
    }, 2000)

    return () => clearTimeout(timer)
  }, [players])

  // Start countdown when all players are ready
  useEffect(() => {
    if (players.every((p) => p.ready) && players.length >= 2) {
      setCountdown(5)
    } else {
      setCountdown(null)
    }
  }, [players])

  // Countdown timer
  useEffect(() => {
    if (countdown === null) return

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      // Navigate to multiplayer quiz
      router.push("/multiplayer/quiz")
    }
  }, [countdown, router])

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
    toast({
      title: "Room code copied!",
      description: "Share with friends to invite them",
    })
  }

  const toggleReady = () => {
    setIsReady(!isReady)
    setPlayers((prev) => prev.map((player) => (player.id === "1" ? { ...player, ready: !isReady } : player)))
  }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Multiplayer Quiz Lobby</CardTitle>
          <div className="flex justify-center items-center gap-2 mt-2">
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md font-mono text-lg">{roomCode}</div>
            <Button variant="ghost" size="icon" onClick={copyRoomCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="font-medium">Players ({players.length}/8)</span>
            </div>
            {countdown !== null && (
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                Starting in {countdown}s
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {players.map((player) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={player.avatar} />
                      <AvatarFallback>{player.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{player.name}</span>
                        {player.isHost && <Crown className="h-4 w-4 text-yellow-500" />}
                      </div>
                      {player.id === "1" && <span className="text-xs text-gray-500">(You)</span>}
                    </div>
                  </div>
                  <Badge variant={player.ready ? "default" : "outline"} className={player.ready ? "bg-green-600" : ""}>
                    {player.ready ? "Ready" : "Not Ready"}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Invite Friends</h3>
            <div className="flex gap-2">
              <Input value={`https://naijaspark.com/join/${roomCode}`} readOnly />
              <Button variant="outline" onClick={copyRoomCode}>
                Copy
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            Leave Room
          </Button>
          <Button
            onClick={toggleReady}
            className={isReady ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}
          >
            {isReady ? "Not Ready" : "Ready"} <Play className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

