"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowRight, CheckCircle, Timer, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"

export default function QuizPreviewSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const { toast } = useToast()

  const demoQuestions = [
    {
      question: "Which Nigerian city is known as the 'Centre of Excellence'?",
      options: ["Abuja", "Lagos", "Port Harcourt", "Kano"],
      correctAnswer: "Lagos",
    },
    {
      question: "What is the name of the Nigerian currency?",
      options: ["Cedi", "Naira", "Rand", "Shilling"],
      correctAnswer: "Naira",
    },
    {
      question: "Which Nigerian dish is made from beans and often eaten for breakfast?",
      options: ["Jollof Rice", "Akara", "Egusi Soup", "Pounded Yam"],
      correctAnswer: "Akara",
    },
  ]

  const handleAnswerSelect = (value: string) => {
    if (isAnswered) return
    setSelectedAnswer(value)
  }

  const checkAnswer = () => {
    if (!selectedAnswer || isAnswered) return

    const isCorrect = selectedAnswer === demoQuestions[currentQuestionIndex].correctAnswer
    setIsAnswered(true)

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1)
      // Trigger confetti for correct answer
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    // Show toast notification
    toast({
      title: isCorrect ? "Correct!" : "Incorrect!",
      description: isCorrect
        ? "Great job! You got it right."
        : `The correct answer is ${demoQuestions[currentQuestionIndex].correctAnswer}.`,
      variant: isCorrect ? "default" : "destructive",
    })
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < demoQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      // Quiz completed
      toast({
        title: "Demo Quiz Completed!",
        description: `You got ${correctAnswers + (isAnswered && selectedAnswer === demoQuestions[currentQuestionIndex].correctAnswer ? 1 : 0)} out of ${demoQuestions.length} questions correct!`,
      })

      // Reset quiz
      setTimeout(() => {
        setCurrentQuestionIndex(0)
        setSelectedAnswer(null)
        setIsAnswered(false)
        setCorrectAnswers(0)
      }, 2000)
    }
  }

  const currentQuestion = demoQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / demoQuestions.length) * 100

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Try a Sample Quiz</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get a taste of our interactive quiz experience with this quick demo.
            </p>
          </motion.div>
        </div>

        <div ref={ref} className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Question {currentQuestionIndex + 1} of {demoQuestions.length}
                  </span>
                  <span className="flex items-center text-sm font-medium">
                    <Timer className="mr-1 h-4 w-4" />
                    Demo Quiz
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">{currentQuestion.question}</h3>

                <RadioGroup value={selectedAnswer || ""} onValueChange={handleAnswerSelect} className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-3 rounded-md border ${
                        isAnswered && option === currentQuestion.correctAnswer
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : isAnswered && option === selectedAnswer
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border-gray-200 dark:border-gray-700"
                      } transition-colors`}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} disabled={isAnswered} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer flex justify-between items-center"
                      >
                        {option}
                        {isAnswered && option === currentQuestion.correctAnswer && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-end">
                {!isAnswered ? (
                  <Button onClick={checkAnswer} disabled={!selectedAnswer} className="bg-green-600 hover:bg-green-700">
                    Check Answer
                  </Button>
                ) : (
                  <Button onClick={goToNextQuestion} className="bg-green-600 hover:bg-green-700">
                    {currentQuestionIndex === demoQuestions.length - 1 ? "Finish" : "Next Question"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

