import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function translateText(req, res) {
  try {
    const { text, targetLanguage } = req.body

    if (!text || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: "Text and target language are required",
      })
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Translation service not configured",
      })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Translate the following text to ${getLanguageName(targetLanguage)}. Only return the translated text, nothing else:

"${text}"`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const translatedText = response.text().trim()

    // Remove any quotes that might be added by the AI
    const cleanedText = translatedText.replace(/^["']|["']$/g, "")

    res.status(200).json({
      success: true,
      translatedText: cleanedText,
      originalText: text,
      targetLanguage,
    })
  } catch (error) {
    console.error("Translation error:", error)
    res.status(500).json({
      success: false,
      message: "Translation failed. Please try again.",
    })
  }
}

function getLanguageName(code) {
  const languages = {
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    ar: "Arabic",
    hi: "Hindi",
    tr: "Turkish",
    nl: "Dutch",
    sv: "Swedish",
    da: "Danish",
    no: "Norwegian",
    fi: "Finnish",
    pl: "Polish",
    cs: "Czech",
    hu: "Hungarian",
  }

  return languages[code] || code
}
