"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const faqs = [
    {
      question: "Do I need to create an account to take quizzes?",
      answer:
        "No, you can take quizzes as a guest. However, creating a free account allows you to save your progress, earn badges, and compete on leaderboards.",
      delay: 0,
    },
    {
      question: "Are the quizzes available in languages other than English?",
      answer:
        "Yes! NaijaSpark Quiz offers content in English, Pidgin English, Yoruba, Igbo, and Hausa. You can select your preferred language before starting a quiz.",
      delay: 0.1,
    },
    {
      question: "How are the leaderboards calculated?",
      answer:
        "Leaderboards are calculated based on quiz scores, completion time, and difficulty level. Higher scores on more difficult quizzes will rank you higher on the leaderboards.",
      delay: 0.2,
    },
    {
      question: "Can I suggest new quiz topics or questions?",
      answer:
        "We welcome community contributions. You can submit suggestions through the feedback form in the Community section or contact us directly.",
      delay: 0.3,
    },
    {
      question: "How often is new content added?",
      answer:
        "We add new quizzes and update existing content regularly, typically adding new categories or special event quizzes monthly.",
      delay: 0.4,
    },
  ]

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about NaijaSpark Quiz.
            </p>
          </motion.div>
        </div>

        <div ref={ref} className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: faq.delay }}
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

