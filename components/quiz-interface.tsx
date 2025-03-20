"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Timer,
  XCircle,
  Bookmark,
  BookmarkCheck,
  PauseCircle,
  PlayCircle,
  RotateCcw,
} from "lucide-react"
import type { Quiz, QuizQuestion } from "@/types/app-types"
import { LanguageSelector } from "@/components/language-selector"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface QuizInterfaceProps {
  quiz: Quiz
}

export default function QuizInterface({ quiz }: QuizInterfaceProps) {
  // Get store values and actions
  const preferredLanguage = useStore((state) => state.preferredLanguage)
  const saveQuizResult = useStore((state) => state.saveQuizResult)
  const saveQuizProgress = useStore((state) => state.saveQuizProgress)
  const getQuizProgress = useStore((state) => state.getQuizProgress)
  const clearQuizProgress = useStore((state) => state.clearQuizProgress)
  const toggleFavorite = useStore((state) => state.toggleFavorite)
  const isFavorite = useStore((state) => state.isFavorite)
  const addNote = useStore((state) => state.addNote)
  const getNotesForQuiz = useStore((state) => state.getNotesForQuiz)

  const router = useRouter()
  const { toast } = useToast()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answers, setAnswers] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [language, setLanguage] = useState<string>(preferredLanguage)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Check if there's a saved progress
  useEffect(() => {
    const savedProgress = getQuizProgress(quiz.id)
    if (savedProgress) {
      // Ask user if they want to continue from where they left off
      const wantsToContinue = window.confirm(
        "You have a saved quiz in progress. Would you like to continue where you left off?",
      )

      if (wantsToContinue) {
        setAnswers(savedProgress.answers)
        setCurrentQuestionIndex(savedProgress.currentQuestionIndex)
        setTimeLeft(savedProgress.timeLeft)
        setQuizStarted(true)

        // If there's an answer for the current question, select it
        if (savedProgress.answers[savedProgress.currentQuestionIndex]) {
          setSelectedAnswer(savedProgress.answers[savedProgress.currentQuestionIndex])
          setIsAnswered(true)
        }
      } else {
        // Clear the saved progress if user doesn't want to continue
        clearQuizProgress(quiz.id)
      }
    }

    // Check if quiz is favorited
    setFavorite(isFavorite(quiz.id))
  }, [quiz.id, getQuizProgress, clearQuizProgress, isFavorite])

  // Timer effect
  useEffect(() => {
    if (!quizStarted || !timeLeft || isPaused) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          finishQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [quizStarted, timeLeft, isPaused])

  // Timer animation effect
  useEffect(() => {
    if (!quizStarted || !timeLeft || !progressBarRef.current) return

    const totalTime = quiz.timeLimit
    const percentLeft = (timeLeft / totalTime) * 100

    progressBarRef.current.style.width = `${percentLeft}%`

    if (percentLeft < 30) {
      progressBarRef.current.style.backgroundColor = "#ef4444" // red-500
    } else if (percentLeft < 60) {
      progressBarRef.current.style.backgroundColor = "#f59e0b" // amber-500
    } else {
      progressBarRef.current.style.backgroundColor = "#22c55e" // green-500
    }
  }, [timeLeft, quizStarted, quiz.timeLimit])

  // Save progress periodically
  useEffect(() => {
    if (!quizStarted || isSubmitting) return

    const saveInterval = setInterval(() => {
      if (!isPaused) {
        saveQuizProgress(quiz.id, answers, currentQuestionIndex, timeLeft)
      }
    }, 10000) // Save every 10 seconds

    return () => clearInterval(saveInterval)
  }, [quizStarted, answers, currentQuestionIndex, timeLeft, isPaused, quiz.id, saveQuizProgress, isSubmitting])

  // Start the quiz
  const startQuiz = () => {
    setQuizStarted(true)
    setTimeLeft(quiz.timeLimit)
    setAnswers(new Array(quiz.questions.length).fill(""))

    // Track quiz start in analytics
    if (typeof window !== "undefined" && "gtag" in window) {
      // @ts-ignore
      window.gtag("event", "start_quiz", {
        quiz_id: quiz.id,
        quiz_title: quiz.title,
        language: language,
      })
    }
  }

  // Handle answer selection
  const handleAnswerSelect = (value: string) => {
    if (isAnswered) return
    setSelectedAnswer(value)
  }

  // Check the selected answer
  const checkAnswer = () => {
    if (!selectedAnswer || isAnswered) return

    const correct = selectedAnswer === quiz.questions[currentQuestionIndex].correctAnswer
    setIsCorrect(correct)
    setIsAnswered(true)
    setShowFeedback(true)

    if (correct) {
      // Trigger confetti for correct answer
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    // Save answer
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = selectedAnswer
    setAnswers(newAnswers)

    // Show feedback for 1.5 seconds
    setTimeout(() => {
      setShowFeedback(false)

      // Wait for animation to complete before moving to next question
      setTimeout(() => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
          setSelectedAnswer(null)
          setIsAnswered(false)
          setIsCorrect(false)
        } else {
          finishQuiz()
        }
      }, 300)
    }, 1500)
  }

  // Go to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0 && !isAnswered) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(answers[currentQuestionIndex - 1])
    }
  }

  // Finish the quiz and save results
  const finishQuiz = () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    const score = calculateScore()

    try {
      // Save quiz result to store
      saveQuizResult({
        quizId: quiz.id,
        quizTitle: quiz.title,
        score,
        totalQuestions: quiz.questions.length,
        date: new Date().toISOString(),
      })

      // Clear the saved progress
      clearQuizProgress(quiz.id)

      // Trigger celebration confetti
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
      })

      // Track quiz completion in analytics
      if (typeof window !== "undefined" && "gtag" in window) {
        // @ts-ignore
        window.gtag("event", "complete_quiz", {
          quiz_id: quiz.id,
          quiz_title: quiz.title,
          score: score,
          total_questions: quiz.questions.length,
          language: language,
        })
      }

      // Redirect to results page
      router.push(`/results?quizId=${quiz.id}&score=${score}&total=${quiz.questions.length}&language=${language}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save quiz results. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  // Calculate the score
  const calculateScore = () => {
    let score = 0
    answers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        score++
      }
    })
    return score
  }

  // Get localized question based on selected language
  const getLocalizedQuestion = (question: QuizQuestion) => {
    if (language === "english" || !question.translations) {
      return question
    }

    const translation = question.translations[language]
    if (!translation) return question

    return {
      ...question,
      question: translation.question || question.question,
      options: translation.options || question.options,
    }
  }

  // Toggle pause state
  const togglePause = () => {
    setIsPaused(!isPaused)

    if (!isPaused) {
      // Save progress when pausing
      saveQuizProgress(quiz.id, answers, currentQuestionIndex, timeLeft)
      toast({
        title: "Quiz paused",
        description: "Your progress has been saved. You can resume anytime.",
      })
    }
  }

  // Toggle favorite
  const handleToggleFavorite = () => {
    toggleFavorite(quiz.id)
    setFavorite(!favorite)

    toast({
      title: favorite ? "Removed from favorites" : "Added to favorites",
      description: favorite
        ? "This quiz has been removed from your favorites."
        : "This quiz has been added to your favorites.",
    })
  }

  // Add note
  const handleAddNote = () => {
    if (!noteText.trim()) return

    addNote(quiz.id, noteText)
    setNoteText("")
    setShowNoteDialog(false)

    toast({
      title: "Note added",
      description: "Your note has been saved for this quiz.",
    })
  }

  // Reset quiz
  const resetQuiz = () => {
    if (confirm("Are you sure you want to reset this quiz? All progress will be lost.")) {
      clearQuizProgress(quiz.id)
      setQuizStarted(false)
      setCurrentQuestionIndex(0)
      setSelectedAnswer(null)
      setAnswers(new Array(quiz.questions.length).fill(""))
      setIsAnswered(false)
      setIsCorrect(false)
      setShowFeedback(false)
      setIsPaused(false)
    }
  }

  // Quiz start screen
  if (!quizStarted) {
    return (
      <motion.div
        className="flex items-center justify-center p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={handleToggleFavorite}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              {favorite ? <BookmarkCheck className="h-5 w-5 text-green-600" /> : <Bookmark className="h-5 w-5" />}
            </Button>
            <CardTitle className="text-2xl text-center">{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{quiz.description}</p>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Timer className="h-5 w-5" />
              <span>Time Limit: {Math.floor(quiz.timeLimit / 60)} minutes</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This quiz contains {quiz.questions.length} questions about {quiz.title.toLowerCase()}.
            </p>

            {quiz.availableLanguages && quiz.availableLanguages.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 font-medium">Select Language:</p>
                <LanguageSelector
                  languages={quiz.availableLanguages}
                  selectedLanguage={language}
                  onLanguageChange={setLanguage}
                />
              </div>
            )}

            {/* Notes section */}
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Your Notes</h3>
                <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Add Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add a note for this quiz</DialogTitle>
                    </DialogHeader>
                    <Textarea
                      placeholder="Write your note here..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <DialogFooter>
                      <Button onClick={handleAddNote}>Save Note</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {getNotesForQuiz(quiz.id).length > 0 ? (
                  getNotesForQuiz(quiz.id).map((note) => (
                    <div key={note.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm">
                      <p>{note.note}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(note.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No notes yet. Add one to help you remember key points.</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
            <Button
              onClick={startQuiz}
              className="bg-green-600 hover:bg-green-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  // Active quiz screen
  const currentQuestion = getLocalizedQuestion(quiz.questions[currentQuestionIndex])
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="p-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePause}
                aria-label={isPaused ? "Resume quiz" : "Pause quiz"}
              >
                {isPaused ? <PlayCircle className="h-5 w-5 text-green-600" /> : <PauseCircle className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={resetQuiz} aria-label="Reset quiz">
                <RotateCcw className="h-5 w-5" />
              </Button>
              <span className="flex items-center text-sm font-medium">
                <Timer className="mr-1 h-4 w-4" />
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />

          {/* Timer progress bar */}
          <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 mt-2 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-green-500 transition-all duration-1000 ease-linear"
              style={{ width: "100%" }}
            ></div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl break-words">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedAnswer || ""} onValueChange={handleAnswerSelect}>
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 mb-4 ${
                        showFeedback && option === currentQuestion.correctAnswer ? "animate-pulse" : ""
                      }`}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} disabled={isAnswered} />
                      <Label
                        htmlFor={`option-${index}`}
                        className={`cursor-pointer flex-1 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 break-words ${
                          showFeedback && option === currentQuestion.correctAnswer
                            ? "border-2 border-green-500 bg-green-50 dark:bg-green-900/20"
                            : showFeedback && option === selectedAnswer && !isCorrect
                              ? "border-2 border-red-500 bg-red-50 dark:bg-red-900/20"
                              : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="pr-2">{option}</span>
                          {showFeedback && option === currentQuestion.correctAnswer && (
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          )}
                          {showFeedback && option === selectedAnswer && !isCorrect && (
                            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-md mt-4 ${
                      isCorrect
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                    }`}
                  >
                    <div className="flex items-center">
                      {isCorrect ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
                      <p>
                        {isCorrect
                          ? "Correct! Well done!"
                          : `Incorrect. The correct answer is "${currentQuestion.correctAnswer}".`}
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0 || isAnswered}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>

                {!isAnswered ? (
                  <Button
                    onClick={checkAnswer}
                    disabled={!selectedAnswer || isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Check Answer
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setShowFeedback(false)
                      setTimeout(() => {
                        if (currentQuestionIndex < quiz.questions.length - 1) {
                          setCurrentQuestionIndex(currentQuestionIndex + 1)
                          setSelectedAnswer(null)
                          setIsAnswered(false)
                          setIsCorrect(false)
                        } else {
                          finishQuiz()
                        }
                      }, 300)
                    }}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {currentQuestionIndex === quiz.questions.length - 1 ? "Finish" : "Next"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

