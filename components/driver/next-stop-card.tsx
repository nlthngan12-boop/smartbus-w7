import { ArrowDownToLine, Eye, MapPin, UsersRound } from 'lucide-react'
import { ROUTE_08, distanceAlong, formatDistance, type BusStop } from '@/lib/route-data'
import { cn } from '@/lib/utils'

const STOP_DEMAND: Record<string, { waiting: number; alighting: boolean; assisted: boolean }> = {
  s0: { waiting: 0, alighting: false, assisted: false },
  s1: { waiting: 0, alighting: false, assisted: false },
  s2: { waiting: 4, alighting: true, assisted: true },
  s3: { waiting: 0, alighting: false, assisted: false },
  s4: { waiting: 6, alighting: false, assisted: false },
  s5: { waiting: 2, alighting: true, assisted: false },
  s6: { waiting: 0, alighting: true, assisted: false },
  s7: { waiting: 0, alighting: false, assisted: false },
  s8: { waiting: 8, alighting: true, assisted: true },
  s9: { waiting: 0, alighting: true, assisted: false },
}

export function NextStopCard({ stop, progress }: { stop: BusStop; progress: number }) {
  const demand = STOP_DEMAND[stop.id]
  const mustStop = demand.waiting > 0 || demand.alighting
  const distance = distanceAlong(ROUTE_08.points, progress, stop.pointIndex)

  return (
    <section
      aria-labelledby="next-stop-title"
      aria-live="polite"
      className={cn('rounded-2xl border-2 p-4', mustStop ? 'border-green-600 bg-green-50' : 'border-border bg-muted')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trạm tiếp theo</p>
          <h2 id="next-stop-title" className="mt-1 flex items-center gap-1.5 truncate text-xl font-bold">
            <MapPin className="size-5 shrink-0 text-driver" aria-hidden="true" />
            {stop.name}
          </h2>
        </div>
        <span className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-sm font-bold tabular-nums shadow-sm">{formatDistance(distance)}</span>
      </div>

      <div className={cn('mt-4 rounded-xl px-4 py-3 text-center', mustStop ? 'bg-green-600 text-white' : 'bg-slate-500 text-white')}>
        <p className="text-2xl font-extrabold">{mustStop ? 'DỪNG ĐÓN / TRẢ KHÁCH' : 'KHÔNG CÓ KHÁCH'}</p>
        <p className="text-sm font-medium opacity-90">{mustStop ? 'Chuẩn bị giảm tốc và tấp vào trạm' : 'Có thể đi qua trạm này'}</p>
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <li className="flex items-center gap-2 rounded-lg bg-white px-3 py-2">
          <UsersRound className="size-5 text-driver" aria-hidden="true" />
          <span><strong className="text-base">{demand.waiting}</strong> khách chờ</span>
        </li>
        <li className="flex items-center gap-2 rounded-lg bg-white px-3 py-2">
          <ArrowDownToLine className="size-5 text-driver" aria-hidden="true" />
          <span>{demand.alighting ? 'Có khách xuống' : 'Không ai xuống'}</span>
        </li>
        {demand.assisted && (
          <li className="col-span-2 flex items-center gap-2 rounded-lg bg-orange-100 px-3 py-2 font-semibold text-orange-800">
            <Eye className="size-5" aria-hidden="true" />
            Có hành khách khiếm thị cần hỗ trợ lên xe
          </li>
        )}
      </ul>
    </section>
  )
}
