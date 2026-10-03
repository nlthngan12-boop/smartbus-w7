'use client'

import type { LucideIcon } from 'lucide-react'
import { ArrowLeft, Mic, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Tone = 'yellow' | 'red' | 'blue' | 'green' | 'purple' | 'orange'

export const TONE_CLASSES: Record<Tone, string> = {
  yellow: 'bg-yellow-400 text-black focus-visible:ring-yellow-600',
  red: 'bg-red-600 text-white focus-visible:ring-red-900',
  blue: 'bg-blue-700 text-white focus-visible:ring-blue-950',
  green: 'bg-green-600 text-white focus-visible:ring-green-900',
  purple: 'bg-purple-700 text-white focus-visible:ring-purple-950',
  orange: 'bg-orange-500 text-black focus-visible:ring-orange-800',
}

export function BigButton({
  icon: Icon,
  label,
  tone,
  onClick,
  className,
  badge,
}: {
  icon: LucideIcon
  label: string
  tone: Tone
  onClick: () => void
  className?: string
  badge?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex min-h-40 flex-col items-center justify-center gap-3 rounded-3xl p-4 text-center shadow-md transition active:scale-[0.97] focus-visible:outline-none focus-visible:ring-8',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {badge && (
        <span className="absolute left-4 top-4 flex size-12 items-center justify-center rounded-full bg-white text-2xl font-black text-black">
          {badge}
        </span>
      )}
      <Icon className="size-16 sm:size-20" strokeWidth={2.4} aria-hidden="true" />
      <span className="text-xl font-extrabold leading-tight sm:text-2xl">{label}</span>
    </button>
  )
}

export function ScreenHeader({
  icon: Icon,
  title,
  tone,
  onBack,
  onRepeat,
}: {
  icon: LucideIcon
  title: string
  tone: Tone
  onBack: () => void
  onRepeat: () => void
}) {
  return (
    <div className="flex items-stretch gap-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="Quay lại menu chính"
        className="flex size-20 shrink-0 items-center justify-center rounded-3xl border-4 border-foreground bg-white focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-foreground/30"
      >
        <ArrowLeft className="size-10" strokeWidth={3} aria-hidden="true" />
      </button>
      <h2 className={cn('flex flex-1 items-center gap-3 rounded-3xl px-5 text-2xl font-extrabold', TONE_CLASSES[tone])}>
        <Icon className="size-10 shrink-0" strokeWidth={2.4} aria-hidden="true" />
        {title}
      </h2>
      <button
        type="button"
        onClick={onRepeat}
        aria-label="Nghe lại hướng dẫn"
        className="flex size-20 shrink-0 items-center justify-center rounded-3xl bg-purple-700 text-white focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-purple-950"
      >
        <RotateCcw className="size-10" strokeWidth={3} aria-hidden="true" />
      </button>
    </div>
  )
}

export function MicButton({ listening, onClick, label }: { listening: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={listening}
      className={cn(
        'flex min-h-36 w-full items-center justify-center gap-4 rounded-3xl text-2xl font-extrabold text-white shadow-md transition focus-visible:outline-none focus-visible:ring-8',
        listening ? 'animate-pulse bg-red-600 focus-visible:ring-red-900' : 'bg-blue-700 focus-visible:ring-blue-950',
      )}
    >
      <Mic className="size-16" strokeWidth={2.4} aria-hidden="true" />
      {listening ? 'Đang nghe...' : label}
    </button>
  )
}
