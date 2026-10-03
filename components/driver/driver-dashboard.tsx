'use client'

import { useMemo } from 'react'
import type { DriverProfile } from '@/lib/driver-auth'
import { ROUTE_08, TRAFFIC_COLORS, pointAt } from '@/lib/route-data'
import { useBusSimulation } from '@/lib/use-bus-simulation'
import { BusMap, type MapSegment } from '@/components/map/bus-map'
import { DriverHeaderBar } from './driver-header-bar'
import { NextStopCard } from './next-stop-card'
import { QuickActions } from './quick-actions'
import { TrafficAhead } from './traffic-ahead'

export function DriverDashboard({ driver }: { driver: DriverProfile }) {
  const { progress, traffic, deviationSec } = useBusSimulation()
  const points = ROUTE_08.points
  const bus = pointAt(points, progress)
  const currentSegment = Math.floor(progress)

  const segments = useMemo<MapSegment[]>(() => {
    const result: MapSegment[] = []
    for (let i = 0; i < points.length - 1; i++) {
      if (i < currentSegment) {
        result.push({ positions: [points[i], points[i + 1]], color: '#94a3b8', weight: 6, opacity: 0.8 })
      } else if (i === currentSegment) {
        result.push({ positions: [points[i], bus], color: '#94a3b8', weight: 6, opacity: 0.8 })
        result.push({ positions: [bus, points[i + 1]], color: TRAFFIC_COLORS[traffic[i]], weight: 8 })
      } else {
        result.push({ positions: [points[i], points[i + 1]], color: TRAFFIC_COLORS[traffic[i]], weight: 8 })
      }
    }
    return result
  }, [points, currentSegment, bus, traffic])

  const nextStop = ROUTE_08.stops.find((s) => s.pointIndex > progress) ?? ROUTE_08.stops[ROUTE_08.stops.length - 1]
  const stops = ROUTE_08.stops.map((s) => ({
    id: s.id,
    name: s.name,
    position: points[s.pointIndex],
    highlight: s.id === nextStop.id,
  }))

  return (
    <div className="flex h-dvh flex-col bg-white">
      <DriverHeaderBar driver={driver} deviationSec={deviationSec} />
      <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 lg:flex-row">
        <section aria-label="Bản đồ lộ trình thông minh" className="relative min-h-[45vh] flex-1 overflow-hidden rounded-2xl border border-border lg:min-h-0">
          <BusMap segments={segments} stops={stops} bus={bus} busColor="#1d4ed8" follow zoom={14} className="absolute inset-0" />
          <div className="pointer-events-none absolute left-3 top-3 z-[400] rounded-xl bg-white/95 px-3 py-2 shadow-md">
            <p className="text-xs font-semibold text-muted-foreground">Giao thông trên tuyến</p>
            <ul className="mt-1.5 flex gap-3 text-xs font-medium">
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-5 rounded-full bg-[#16a34a]" />Thông thoáng</li>
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-5 rounded-full bg-[#eab308]" />Đông xe</li>
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-5 rounded-full bg-[#dc2626]" />Ùn tắc</li>
            </ul>
          </div>
          <TrafficAhead progress={progress} traffic={traffic} />
        </section>

        <aside className="flex flex-col gap-3 lg:w-[400px] lg:shrink-0">
          <NextStopCard stop={nextStop} progress={progress} />
          <QuickActions position={bus} />
        </aside>
      </main>
    </div>
  )
}
