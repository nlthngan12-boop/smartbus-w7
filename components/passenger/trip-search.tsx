'use client'

import { useState } from 'react'
import { ArrowUpDown, Briefcase, GraduationCap, House, LocateFixed, MapPin, Search } from 'lucide-react'
import { SAVED_PLACES } from '@/lib/passenger-data'

const PLACE_ICONS = { home: House, work: Briefcase, school: GraduationCap } as const

export function TripSearch({ onSearch }: { onSearch: (destination: string) => void }) {
  const [from, setFrom] = useState('Vị trí của bạn')
  const [to, setTo] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (to.trim()) onSearch(to.trim())
  }

  return (
    <section aria-labelledby="search-title">
      <h1 id="search-title" className="text-2xl font-bold text-balance">
        Bạn muốn đi đâu?
      </h1>
      <form onSubmit={submit} className="mt-4 rounded-2xl border border-border bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <label className="flex h-11 items-center gap-3 rounded-xl bg-muted px-3">
              <LocateFixed className="size-4 shrink-0 text-passenger" aria-hidden="true" />
              <span className="sr-only">Điểm đi</span>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full bg-transparent text-sm font-medium outline-none"
              />
            </label>
            <label className="flex h-11 items-center gap-3 rounded-xl bg-muted px-3 focus-within:ring-2 focus-within:ring-passenger/40">
              <MapPin className="size-4 shrink-0 text-red-500" aria-hidden="true" />
              <span className="sr-only">Điểm đến</span>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Nhập điểm đến, trạm hoặc số tuyến"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => {
              setFrom(to || 'Vị trí của bạn')
              setTo(from === 'Vị trí của bạn' ? '' : from)
            }}
            aria-label="Đổi điểm đi và điểm đến"
            className="flex size-10 items-center justify-center rounded-full border border-border hover:bg-muted"
          >
            <ArrowUpDown className="size-4" aria-hidden="true" />
          </button>
        </div>
        <button
          type="submit"
          disabled={!to.trim()}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-passenger text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-passenger/30 disabled:opacity-50"
        >
          <Search className="size-4" aria-hidden="true" />
          Tìm đường
        </button>
      </form>

      <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Địa điểm đã lưu">
        {SAVED_PLACES.map((place) => {
          const Icon = PLACE_ICONS[place.id as keyof typeof PLACE_ICONS]
          return (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => {
                  setTo(place.label)
                  onSearch(place.label)
                }}
                className="flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-white px-3.5 py-2 text-sm font-medium hover:border-passenger hover:bg-passenger-soft"
              >
                <Icon className="size-4 text-passenger" aria-hidden="true" />
                {place.label}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
