"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface LanguageSelectorProps {
  languages: string[]
  selectedLanguage: string
  onLanguageChange: (language: string) => void
}

export function LanguageSelector({ languages, selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const getLanguageLabel = (code: string) => {
    const labels: Record<string, string> = {
      english: "English",
      pidgin: "Pidgin English",
      yoruba: "Yoruba",
      igbo: "Igbo",
      hausa: "Hausa",
    }

    return labels[code] || code
  }

  return (
    <RadioGroup value={selectedLanguage} onValueChange={onLanguageChange} className="flex flex-wrap gap-4">
      {languages.map((lang) => (
        <div key={lang} className="flex items-center space-x-2">
          <RadioGroupItem value={lang} id={`lang-${lang}`} />
          <Label htmlFor={`lang-${lang}`}>{getLanguageLabel(lang)}</Label>
        </div>
      ))}
    </RadioGroup>
  )
}

