'use client'

import { useEffect, useState } from 'react'
import { Bus, Footprints, MapPin, Navigation, Search } from 'lucide-react'
import { buildDestinationGuidance } from '@/lib/passenger-data'
import type { useSpeech } from '@/lib/use-speech'
import { MicButton, ScreenHeader } from './ui'

const INTRO = 'Dẫn đường. Nhấn nút micro màu xanh dương ở giữa màn hình, rồi nói tên nơi bạn muốn đến.'

export function NavigateView({
  speech,
  onBack,
  onRepeat,
}: {
  speech: ReturnType<typeof useSpeech>
  onBack: () => void
  onRepeat: () => void
}) {
  const [destination, setDestination] = useState('')
  const [typed, setTyped] = useState('')
  const { speak } = speech

  useEffect(() => {
    speak(INTRO)
  }, [speak])

  function go(place: string) {
    setDestination(place)
    speak(buildDestinationGuidance(place))
  }

  function listen() {
    speech.listen(
      (transcript) => (transcript.trim() ? go(transcript.trim()) : speak('Chưa nghe rõ. Vui lòng thử lại.')),
      (reason) =>
        speak(
          reason === 'unsupported'
            ? 'Trình duyệt chưa hỗ trợ nhận giọng nói. Vui lòng nhập điểm đến vào ô bên dưới.'
            : 'Chưa nghe rõ. Vui lòng nhấn micro và nói lại.',
        ),
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <ScreenHeader icon={Navigation} title="Dẫn đường" tone="blue" onBack={onBack} onRepeat={onRepeat} />
      <MicButton listening={speech.listening} onClick={listen} label="Nói nơi muốn đến" />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (typed.trim()) go(typed.trim())
        }}
        className="flex gap-3"
      >
        <label className="flex-1">
          <span className="sr-only">Nhập điểm đến</span>
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Hoặc nhập điểm đến"
            className="h-20 w-full rounded-3xl border-4 border-foreground px-5 text-2xl font-bold outline-none focus-visible:ring-8 focus-visible:ring-blue-700/40"
          />
        </label>
        <button
          type="submit"
          aria-label="Tìm đường"
          className="flex size-20 items-center justify-center rounded-3xl bg-green-600 text-white focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-green-900"
        >
          <Search className="size-10" strokeWidth={3} aria-hidden="true" />
        </button>
      </form>

      {destination && (
        <div className="grid flex-1 grid-cols-3 gap-4" aria-label={`Đường đến ${destination}`}>
          <div className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-yellow-400 p-4 text-center text-black shadow-md">
            <Footprints className="size-14" aria-hidden="true" />
            <span className="text-4xl font-black">200m</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-blue-700 p-4 text-center text-white shadow-md">
            <Bus className="size-14" aria-hidden="true" />
            <span className="text-4xl font-black">08</span>
            <span className="text-lg font-bold">3 phút</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-red-600 p-4 text-center text-white shadow-md">
            <MapPin className="size-14" aria-hidden="true" />
            <span className="line-clamp-2 text-xl font-black">{destination}</span>
          </div>
        </div>
      )}
    </div>
  )
}
