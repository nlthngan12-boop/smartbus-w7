import { ArrowLeft, ChevronRight, Footprints } from 'lucide-react'

const OPTIONS = [
  { id: 'a', routes: [{ n: '08', c: '#16a34a' }], total: 32, walk: 6, fare: '7.000đ', leaveIn: 3, tag: 'Nhanh nhất' },
  { id: 'b', routes: [{ n: '19', c: '#0284c7' }, { n: '56', c: '#ea580c' }], total: 41, walk: 4, fare: '12.000đ', leaveIn: 7, tag: 'Ít đi bộ' },
  { id: 'c', routes: [{ n: '01', c: '#7c3aed' }], total: 48, walk: 9, fare: '6.000đ', leaveIn: 14, tag: 'Rẻ nhất' },
]

export function TripResults({ destination, onClose }: { destination: string; onClose: () => void }) {
  return (
    <section aria-labelledby="results-title">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Quay lại"
          className="flex size-9 items-center justify-center rounded-full hover:bg-muted"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <h2 id="results-title" className="text-lg font-bold">
          Đến <span className="text-passenger">{destination}</span>
        </h2>
      </div>
      <ul className="mt-3 flex flex-col gap-3">
        {OPTIONS.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl border border-border p-4 text-left transition hover:border-passenger hover:shadow-sm"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Footprints className="size-4 text-muted-foreground" aria-hidden="true" />
                  {o.routes.map((r) => (
                    <span key={r.n} className="flex items-center gap-1.5">
                      <ChevronRight className="size-3 text-muted-foreground" aria-hidden="true" />
                      <span className="rounded-md px-2 py-0.5 text-sm font-bold text-white" style={{ backgroundColor: r.c }}>
                        {r.n}
                      </span>
                    </span>
                  ))}
                  <span className="ml-2 rounded-full bg-passenger-soft px-2 py-0.5 text-xs font-semibold text-passenger">{o.tag}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Đi bộ {o.walk} phút · {o.fare} · Xe đến sau {o.leaveIn} phút
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold tabular-nums">{o.total}</p>
                <p className="text-xs text-muted-foreground">phút</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
