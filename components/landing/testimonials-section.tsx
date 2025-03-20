"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Quote, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: "Chioma Okafor",
      role: "Student",
      // Image is no longer used; the icon is displayed instead
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "NaijaSpark Quiz has been an incredible way for me to learn more about my Nigerian heritage. The quizzes are fun, challenging, and I love competing with my friends on the leaderboard!",
    },
    {
      name: "Emeka Nwosu",
      role: "Teacher",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "As a teacher, I use NaijaSpark Quiz to engage my students in learning about Nigerian culture. The diverse categories and language options make it accessible for everyone.",
    },
    {
      name: "Amina Ibrahim",
      role: "Cultural Enthusiast",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "I've tried many quiz platforms, but NaijaSpark stands out with its depth of content and engaging format. I've earned 15 badges so far and I'm aiming for more!",
    },
    {
      name: "Tunde Adeyemi",
      role: "Nigerian in Diaspora",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "Living abroad, NaijaSpark Quiz helps me stay connected to my roots. I've learned so much about Nigerian history and culture that I didn't know before.",
    },
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hear from people who have expanded their knowledge of Nigerian culture through our platform.
            </p>
          </motion.div>
        </div>

        <div ref={ref} className="relative max-w-4xl mx-auto">
          <div className="absolute -top-10 -left-10 text-green-200 dark:text-green-800">
            <Quote className="h-20 w-20" />
          </div>

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <p className="text-lg md:text-xl mb-6 text-gray-600 dark:text-gray-300 italic">
                  "{testimonials[currentIndex].quote}"
                </p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    {/* Instead of displaying an image, we now use the User icon */}
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold">{testimonials[currentIndex].name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="flex justify-center mt-8 gap-2">
            <Button variant="outline" size="icon" onClick={prevTestimonial}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={`w-2 h-2 rounded-full p-0 min-w-0 ${
                  index === currentIndex ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
            <Button variant="outline" size="icon" onClick={nextTestimonial}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

