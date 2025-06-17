"use client"

import { useState } from "react"
import { Languages, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

const TranslateButton = ({ text, onTranslate, disabled }) => {
  const [isTranslating, setIsTranslating] = useState(false)
  const [showLanguageSelect, setShowLanguageSelect] = useState(false)

  const languages = [
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "tr", name: "Turkish" },
    { code: "nl", name: "Dutch" },
    { code: "sv", name: "Swedish" },
    { code: "da", name: "Danish" },
    { code: "no", name: "Norwegian" },
    { code: "fi", name: "Finnish" },
    { code: "pl", name: "Polish" },
    { code: "cs", name: "Czech" },
    { code: "hu", name: "Hungarian" },
  ]

  const translateText = async (targetLanguage) => {
    if (!text.trim()) {
      toast.error("Please enter some text to translate")
      return
    }

    setIsTranslating(true)
    setShowLanguageSelect(false)

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          targetLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error("Translation failed")
      }

      const data = await response.json()

      if (data.success) {
        onTranslate(data.translatedText)
        toast.success(`Translated to ${languages.find((l) => l.code === targetLanguage)?.name}`)
      } else {
        throw new Error(data.message || "Translation failed")
      }
    } catch (error) {
      console.error("Translation error:", error)
      toast.error("Failed to translate text. Please try again.")
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowLanguageSelect(!showLanguageSelect)}
        disabled={disabled || isTranslating || !text.trim()}
        className="btn btn-ghost btn-sm btn-circle"
        title="Translate message"
      >
        {isTranslating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
      </button>

      {showLanguageSelect && (
        <div className="absolute bottom-full right-0 mb-2 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-base-content/70 mb-2 px-2">Translate to:</div>
            <div className="grid grid-cols-2 gap-1 min-w-[200px]">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => translateText(language.code)}
                  className="text-left px-2 py-1 text-sm hover:bg-base-200 rounded transition-colors"
                  disabled={isTranslating}
                >
                  {language.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TranslateButton
