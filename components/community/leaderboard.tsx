"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, ArrowUp, ArrowDown, Minus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface LeaderboardEntry {
  id: string
  rank: number
  previousRank: number
  name: string
  avatar?: string
  score: number
  quizzesTaken: number
  badge: string
  isCurrentUser: boolean
}

export default function Leaderboard() {
  const [timeRange, setTimeRange] = useState("week")
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const data: LeaderboardEntry[] = [
        {
          id: "1",
          rank: 1,
          previousRank: 1,
          name: "Chioma A.",
          avatar: "/avatars/chioma.png",
          score: 9850,
          quizzesTaken: 42,
          badge: "Nigerian Expert",
          isCurrentUser: false,
        },
        {
          id: "2",
          rank: 2,
          previousRank: 3,
          name: "Oluwaseun K.",
          avatar: "/avatars/oluwaseun.png",
          score: 9720,
          quizzesTaken: 38,
          badge: "History Buff",
          isCurrentUser: false,
        },
        {
          id: "3",
          rank: 3,
          previousRank: 2,
          name: "Emeka O.",
          avatar: "/avatars/emeka.png",
          score: 9650,
          quizzesTaken: 45,
          badge: "Culture Master",
          isCurrentUser: false,
        },
        {
          id: "4",
          rank: 4,
          previousRank: 6,
          name: "You",
          avatar: undefined,
          score: 9400,
          quizzesTaken: 36,
          badge: "Rising Star",
          isCurrentUser: true,
        },
        {
          id: "5",
          rank: 5,
          previousRank: 4,
          name: "Ngozi I.",
          avatar: "/avatars/ngozi.png",
          score: 9350,
          quizzesTaken: 39,
          badge: "Quiz Champion",
          isCurrentUser: false,
        },
        {
          id: "6",
          rank: 6,
          previousRank: 5,
          name: "Adebayo T.",
          avatar: "/avatars/adebayo.png",
          score: 9200,
          quizzesTaken: 41,
          badge: "Knowledge Seeker",
          isCurrentUser: false,
        },
        {
          id: "7",
          rank: 7,
          previousRank: 7,
          name: "Fatima M.",
          avatar: "/avatars/fatima.png",
          score: 9100,
          quizzesTaken: 37,
          badge: "Trivia Master",
          isCurrentUser: false,
        },
        {
          id: "8",
          rank: 8,
          previousRank: 10,
          name: "Chinedu E.",
          avatar: "/avatars/chinedu.png",
          score: 8950,
          quizzesTaken: 34,
          badge: "Quiz Enthusiast",
          isCurrentUser: false,
        },
        {
          id: "9",
          rank: 9,
          previousRank: 8,
          name: "Amina Y.",
          avatar: "/avatars/amina.png",
          score: 8900,
          quizzesTaken: 33,
          badge: "Naija Patriot",
          isCurrentUser: false,
        },
        {
          id: "10",
          rank: 10,
          previousRank: 9,
          name: "Tunde A.",
          avatar: "/avatars/tunde.png",
          score: 8850,
          quizzesTaken: 35,
          badge: "Quiz Wizard",
          isCurrentUser: false,
        },
      ]

      setEntries(data)
      setIsLoading(false)
    }, 1000)
  }, [timeRange])

  const getRankChangeIcon = (current: number, previous: number) => {
    if (current < previous) {
      return <ArrowUp className="h-4 w-4 text-green-600" />
    } else if (current > previous) {
      return <ArrowDown className="h-4 w-4 text-red-600" />
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getRankChangeText = (current: number, previous: number) => {
    if (current < previous) {
      return `Up ${previous - current}`
    } else if (current > previous) {
      return `Down ${current - previous}`
    } else {
      return "No change"
    }
  }

  const getTopRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-700" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>See how you rank against other quiz takers</CardDescription>
          </div>
          <Tabs defaultValue="week" value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="week">Weekly</TabsTrigger>
              <TabsTrigger value="month">Monthly</TabsTrigger>
              <TabsTrigger value="alltime">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-12 text-sm font-medium text-gray-500 dark:text-gray-400 px-4 py-2">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">User</div>
              <div className="col-span-2 text-right">Score</div>
              <div className="col-span-2 text-right">Quizzes</div>
              <div className="col-span-2 text-right">Change</div>
            </div>

            <AnimatePresence>
              {entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`grid grid-cols-12 items-center px-4 py-3 rounded-lg ${
                    entry.isCurrentUser
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  <div className="col-span-1 flex items-center">
                    <span className="font-bold">{entry.rank}</span>
                    {getTopRankIcon(entry.rank)}
                  </div>

                  <div className="col-span-5 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={entry.avatar} />
                      <AvatarFallback>{entry.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{entry.name}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {entry.badge}
                      </Badge>
                    </div>
                  </div>

                  <div className="col-span-2 text-right font-medium">{entry.score.toLocaleString()}</div>

                  <div className="col-span-2 text-right text-gray-600 dark:text-gray-300">{entry.quizzesTaken}</div>

                  <div className="col-span-2 text-right flex items-center justify-end gap-1">
                    {getRankChangeIcon(entry.rank, entry.previousRank)}
                    <span className="text-xs">{getRankChangeText(entry.rank, entry.previousRank)}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

