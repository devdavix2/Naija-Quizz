import type { Metadata } from "next"
import QuizLobby from "@/components/multiplayer/quiz-lobby"

export const metadata: Metadata = {
  title: "Multiplayer Quiz | NaijaSpark Quiz",
  description: "Challenge your friends to a Nigerian knowledge quiz",
}

export default function MultiplayerPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Multiplayer Quiz</h1>
      <QuizLobby />
    </div>
  )
}

