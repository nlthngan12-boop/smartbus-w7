'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type RecognitionLike = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  onresult: ((e: { results: { 0: { 0: { transcript: string } } } }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
}

type RecognitionCtor = new () => RecognitionLike

function getRecognition(): RecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export function useSpeech() {
  const [lastMessage, setLastMessage] = useState('')
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<RecognitionLike | null>(null)

  const speak = useCallback((text: string) => {
    setLastMessage(text)
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'vi-VN'
    utterance.rate = 0.95
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith('vi'))
    if (voice) utterance.voice = voice
    window.speechSynthesis.speak(utterance)
  }, [])

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
  }, [])

  const listen = useCallback(
    (onResult: (transcript: string) => void, onError?: (reason: string) => void) => {
      const Recognition = getRecognition()
      if (!Recognition) {
        onError?.('unsupported')
        return
      }
      stopSpeaking()
      recognitionRef.current?.stop()
      const recognition = new Recognition()
      recognition.lang = 'vi-VN'
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      recognition.onresult = (e) => onResult(e.results[0][0].transcript)
      recognition.onerror = (e) => onError?.(e.error)
      recognition.onend = () => setListening(false)
      recognitionRef.current = recognition
      setListening(true)
      try {
        recognition.start()
      } catch {
        setListening(false)
        onError?.('start-failed')
      }
    },
    [stopSpeaking],
  )

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [])

  return { speak, stopSpeaking, listen, listening, lastMessage }
}

const NUMBER_WORDS: Record<string, number> = {
  một: 1,
  mốt: 1,
  hai: 2,
  ba: 3,
  bốn: 4,
  tư: 4,
  năm: 5,
  sáu: 6,
}

export function parseSpokenNumber(transcript: string): number | undefined {
  const digit = transcript.match(/\d+/)
  if (digit) return Number(digit[0])
  for (const word of transcript.toLowerCase().split(/\s+/)) {
    if (NUMBER_WORDS[word]) return NUMBER_WORDS[word]
  }
  return undefined
}
