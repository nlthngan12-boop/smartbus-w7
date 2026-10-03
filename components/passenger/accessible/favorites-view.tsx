'use client'

import { useEffect, useState } from 'react'
import { Bus, Star } from 'lucide-react'
import { FAVORITE_ROUTES, buildFavoriteGuidance } from '@/lib/passenger-data'
import { parseSpokenNumber, type useSpeech } from '@/lib/use-speech'
import { cn } from '@/lib/utils'
import { MicButton, ScreenHeader, TONE_CLASSES, type Tone } from './ui'

const TONES: Tone[] = ['green', 'purple', 'orange']

const INTRO = `Lộ trình yêu thích. ${FAVORITE_ROUTES.map(
  (f, i) => `Số ${i + 1}: đến ${f.to}, xe ${f.route}`,
).join('. ')}. Nhấn nút micro rồi nói số lộ trình, hoặc chạm vào số.`

export function FavoritesView({
  speech,
  onBack,
  onRepeat,
}: {
  speech: ReturnType<typeof useSpeech>
  onBack: () => void
  onRepeat: () => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const { speak } = speech

  useEffect(() => {
    speak(INTRO)
  }, [speak])

  function choose(n: number) {
    const fav = FAVORITE_ROUTES[n - 1]
    if (!fav) {
      speak(`Không có lộ trình số ${n}. Vui lòng nói số từ 1 đến ${FAVORITE_ROUTES.length}.`)
      return
    }
    setSelected(n)
    speak(buildFavoriteGuidance(n, fav))
  }

  function listenForNumber() {
    speech.listen(
      (transcript) => {
        const n = parseSpokenNumber(transcript)
        if (n) choose(n)
        else speak('Chưa nghe rõ số. Vui lòng nhấn micro và nói lại.')
      },
      (reason) =>
        speak(
          reason === 'unsupported'
            ? 'Trình duyệt chưa hỗ trợ nhận giọng nói. Vui lòng chạm vào số lộ trình.'
            : 'Chưa nghe rõ. Vui lòng thử lại.',
        ),
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <ScreenHeader icon={Star} title="Yêu thích" tone="yellow" onBack={onBack} onRepeat={onRepeat} />
      <MicButton listening={speech.listening} onClick={listenForNumber} label="Nói số lộ trình" />
      <ul className="grid flex-1 gap-4 sm:grid-cols-3">
        {FAVORITE_ROUTES.map((fav, i) => (
          <li key={fav.id}>
            <button
              type="button"
              onClick={() => choose(i + 1)}
              aria-label={`Lộ trình số ${i + 1}: đến ${fav.to}, xe ${fav.route}`}
              aria-pressed={selected === i + 1}
              className={cn(
                'flex size-full min-h-36 items-center gap-4 rounded-3xl p-5 text-left shadow-md transition focus-visible:outline-none focus-visible:ring-8',
                TONE_CLASSES[TONES[i % TONES.length]],
                selected === i + 1 && 'ring-8 ring-foreground',
              )}
            >
              <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-white text-5xl font-black text-black">
                {i + 1}
              </span>
              <span className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-3xl font-black">
                  <Bus className="size-8" aria-hidden="true" />
                  {fav.route}
                </span>
                <span className="text-xl font-bold leading-tight">{fav.to}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
