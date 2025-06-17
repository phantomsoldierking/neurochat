import React, { useState, useCallback } from 'react';
import { MessageInput, useChannelStateContext, useMessageInputContext } from 'stream-chat-react';
import toast from 'react-hot-toast';

// Language options for translation
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ur', name: 'Urdu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' },
];

// Custom message input with translation
const CustomMessageInputUI = (props) => {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslateOptions, setShowTranslateOptions] = useState(false);

  // Get the message input context to access text and setText
  const { text, setText } = useMessageInputContext();

  const translateText = async (textToTranslate, targetLanguage) => {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      toast.error('Gemini API key not configured');
      return null;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Translate the following text to ${targetLanguage}. Only return the translated text, nothing else: "${textToTranslate}"`
                  }
                ]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text?.trim();
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed. Please try again.');
      return null;
    }
  };

  const handleTranslate = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to translate');
      return;
    }

    setIsTranslating(true);
    try {
      const targetLanguageName = LANGUAGES.find(lang => lang.code === selectedLanguage)?.name;
      const translatedText = await translateText(text, targetLanguageName);
      
      if (translatedText) {
        setText(translatedText);
        toast.success(`Translated to ${targetLanguageName}!`);
        setShowTranslateOptions(false);
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="relative">
      {showTranslateOptions && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm font-medium text-gray-700">
              Translate to:
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleTranslate}
              disabled={isTranslating || !text.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
            <button
              onClick={() => setShowTranslateOptions(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <MessageInput {...props} />
        </div>
        <button
          onClick={() => setShowTranslateOptions(!showTranslateOptions)}
          disabled={isTranslating}
          className="mb-2 px-3 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          title="Translate message"
        >
          🌐 Translate
        </button>
      </div>
    </div>
  );
};

const TranslateMessageInput = () => {
  return (
    <MessageInput 
      focus 
      audioRecordingEnabled 
      Input={CustomMessageInputUI}
    />
  );
};

export default TranslateMessageInput;