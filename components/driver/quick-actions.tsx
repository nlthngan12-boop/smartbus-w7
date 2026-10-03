'use client'

import { useRef, useState, useTransition } from 'react'
import { CircleCheck, Loader2, Siren, TrafficCone } from 'lucide-react'
import { sendDriverAlert } from '@/app/actions/driver'
import type { LatLng } from '@/lib/route-data'
import { cn } from '@/lib/utils'

const HOLD_MS = 2000

type Feedback = { tone: 'ok' | 'error'; text: string } | null

export function QuickActions({ position }: { position: LatLng }) {
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [incidentPending, startIncident] = useTransition()
  const [sosPending, startSos] = useTransition()
  const [holdProgress, setHoldProgress] = useState(0)
  const holdStart = useRef<number | null>(null)
  const frame = useRef<number | null>(null)
  const positionRef = useRef(position)
  positionRef.current = position

  function send(kind: 'incident' | 'sos') {
    const [lat, lng] = positionRef.current
    const start = kind === 'sos' ? startSos : startIncident
    start(async () => {
      const res = await sendDriverAlert({ kind, lat, lng })
      if (res.ok) {
        const time = new Date(res.sentAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        setFeedback({
          tone: 'ok',
          text:
            kind === 'sos'
              ? `Đã gửi SOS lúc ${time} (mã ${res.ticket}). Trung tâm sẽ liên hệ ngay.`
              : `Đã gửi tọa độ kẹt xe / sự cố lúc ${time} (mã ${res.ticket}).`,
        })
      } else {
        setFeedback({ tone: 'error', text: res.error })
      }
    })
  }

  function startHold() {
    if (sosPending) return
    holdStart.current = performance.now()
    const step = () => {
      if (holdStart.current === null) return
      const ratio = Math.min(1, (performance.now() - holdStart.current) / HOLD_MS)
      setHoldProgress(ratio)
      if (ratio >= 1) {
        holdStart.current = null
        if (navigator.vibrate) navigator.vibrate(300)
        send('sos')
        setTimeout(() => setHoldProgress(0), 600)
        return
      }
      frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
  }

  function cancelHold() {
    if (holdStart.current === null) return
    holdStart.current = null
    if (frame.current) cancelAnimationFrame(frame.current)
    setHoldProgress(0)
  }

  return (
    <section aria-label="Thao tác nhanh và báo động khẩn cấp" className="flex flex-1 flex-col gap-3">
      <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-1">
        <button
          type="button"
          onClick={() => send('incident')}
          disabled={incidentPending}
          className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl bg-yellow-400 p-4 text-black shadow-sm transition active:scale-[0.98] hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-500/50 disabled:opacity-80 lg:flex-row lg:gap-4"
        >
          {incidentPending ? <Loader2 className="size-10 animate-spin" aria-hidden="true" /> : <TrafficCone className="size-10" aria-hidden="true" />}
          <span className="text-center lg:text-left">
            <span className="block text-xl font-extrabold">Báo kẹt xe / Sự cố</span>
            <span className="block text-sm font-medium opacity-80">Chạm 1 lần để gửi tọa độ</span>
          </span>
        </button>

        <button
          type="button"
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
              e.preventDefault()
              startHold()
            }
          }}
          onKeyUp={cancelHold}
          onContextMenu={(e) => e.preventDefault()}
          aria-label="Gửi tín hiệu khẩn cấp SOS. Bấm giữ 2 giây để gửi"
          className="relative flex min-h-28 touch-none select-none flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-red-600 p-4 text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/50 lg:flex-row lg:gap-4"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 bg-red-900/60"
            style={{ width: `${holdProgress * 100}%` }}
          />
          <span className="relative">
            {sosPending ? <Loader2 className="size-10 animate-spin" aria-hidden="true" /> : <Siren className="size-10" aria-hidden="true" />}
          </span>
          <span className="relative text-center lg:text-left">
            <span className="block text-xl font-extrabold">SOS khẩn cấp</span>
            <span className="block text-sm font-medium opacity-90">
              {holdProgress > 0 ? `Giữ tiếp... ${Math.ceil((1 - holdProgress) * 2)}s` : 'Bấm giữ 2 giây'}
            </span>
          </span>
        </button>
      </div>

      <div aria-live="assertive" className="min-h-12">
        {feedback && (
          <p
            className={cn(
              'flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-medium',
              feedback.tone === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700',
            )}
          >
            <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {feedback.text}
          </p>
        )}
      </div>
    </section>
  )
}
