import { ROUTE_08, TRAFFIC_COLORS, TRAFFIC_LABELS, distanceAlong, formatDistance, type TrafficLevel } from '@/lib/route-data'

const RADIUS_M = 2000

export function TrafficAhead({ progress, traffic }: { progress: number; traffic: TrafficLevel[] }) {
  const points = ROUTE_08.points
  const items: { road: string; level: TrafficLevel; distance: number }[] = []

  for (let i = Math.floor(progress); i < points.length - 1; i++) {
    const distance = i === Math.floor(progress) ? 0 : distanceAlong(points, progress, i)
    if (distance > RADIUS_M) break
    const road = ROUTE_08.roadNames[i]
    const last = items[items.length - 1]
    if (last && last.road === road && last.level === traffic[i]) continue
    items.push({ road, level: traffic[i], distance })
  }

  return (
    <div className="absolute bottom-3 left-3 right-3 z-[400] rounded-xl bg-white/95 p-3 shadow-md sm:right-auto sm:w-80">
      <p className="text-xs font-semibold text-muted-foreground">Phía trước trong bán kính 2 km</p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {items.slice(0, 4).map((item, i) => (
          <li key={`${item.road}-${i}`} className="flex items-center gap-2 text-sm">
            <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: TRAFFIC_COLORS[item.level] }} aria-hidden="true" />
            <span className="flex-1 truncate font-medium">{item.road}</span>
            <span className="text-xs text-muted-foreground">{item.distance === 0 ? 'Hiện tại' : formatDistance(item.distance)}</span>
            <span className="w-20 text-right text-xs font-semibold" style={{ color: item.level === 'busy' ? '#a16207' : TRAFFIC_COLORS[item.level] }}>
              {TRAFFIC_LABELS[item.level]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
