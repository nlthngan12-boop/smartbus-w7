import { Footprints, UsersRound } from 'lucide-react'
import { NEARBY_ARRIVALS } from '@/lib/passenger-data'
import { cn } from '@/lib/utils'

const CROWD = {
  low: { label: 'Vắng', className: 'text-green-700 bg-green-50' },
  medium: { label: 'Vừa', className: 'text-yellow-800 bg-yellow-50' },
  high: { label: 'Đông', className: 'text-red-700 bg-red-50' },
}

export function NearbyArrivals() {
  return (
    <section aria-labelledby="nearby-title">
      <div className="flex items-baseline justify-between">
        <h2 id="nearby-title" className="text-lg font-bold">
          Xe sắp đến gần bạn
        </h2>
        <span className="flex items-center gap-1.5 text-xs font-medium text-passenger">
          <span className="size-2 animate-pulse rounded-full bg-passenger" aria-hidden="true" />
          Trực tiếp
        </span>
      </div>
      <ul className="mt-3 divide-y divide-border rounded-2xl border border-border">
        {NEARBY_ARRIVALS.map((a) => (
          <li key={a.route} className="flex items-center gap-3 p-3.5">
            <span
              className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg text-base font-bold text-white"
              style={{ backgroundColor: a.color }}
            >
              {a.route}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{a.headsign}</p>
              <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <Footprints className="size-3.5" aria-hidden="true" />
                {a.walkMinutes} phút · {a.stop}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-sm font-bold">
                <span className="text-lg tabular-nums text-passenger">{a.minutes}</span> phút
              </p>
              <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold', CROWD[a.crowd].className)}>
                <UsersRound className="size-3" aria-hidden="true" />
                {CROWD[a.crowd].label}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
