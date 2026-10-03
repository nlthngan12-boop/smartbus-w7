import { ArrowRight, Star } from 'lucide-react'
import { FAVORITE_ROUTES } from '@/lib/passenger-data'

export function FavoriteRoutes() {
  return (
    <section aria-labelledby="fav-title">
      <h2 id="fav-title" className="flex items-center gap-2 text-lg font-bold">
        <Star className="size-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
        Lộ trình yêu thích
      </h2>
      <ul className="mt-3 flex flex-col gap-2">
        {FAVORITE_ROUTES.map((f) => (
          <li key={f.id} className="flex items-center gap-3 rounded-2xl bg-passenger-soft p-3.5">
            <span className="rounded-md px-2 py-0.5 text-sm font-bold text-white" style={{ backgroundColor: f.color }}>
              {f.route}
            </span>
            <p className="flex min-w-0 flex-1 items-center gap-1.5 text-sm font-medium">
              <span className="truncate">{f.from}</span>
              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="truncate">{f.to}</span>
            </p>
            <span className="text-xs text-muted-foreground">{f.minutes} phút</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
