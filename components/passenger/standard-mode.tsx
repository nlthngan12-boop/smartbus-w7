'use client'

import { useMemo, useState } from 'react'
import { Bus, Eye } from 'lucide-react'
import { ROUTE_08, pointAt } from '@/lib/route-data'
import { USER_LOCATION } from '@/lib/passenger-data'
import { BusMap, type MapSegment } from '@/components/map/bus-map'
import { RoleSwitchButton } from '@/components/role-switch-button'
import { TripSearch } from './trip-search'
import { TripResults } from './trip-results'
import { NearbyArrivals } from './nearby-arrivals'
import { FavoriteRoutes } from './favorite-routes'

export function StandardMode({ onEnableAccessible }: { onEnableAccessible: () => void }) {
  const [destination, setDestination] = useState<string | null>(null)

  const segments = useMemo<MapSegment[]>(
    () => [{ positions: ROUTE_08.points.slice(0, 10), color: '#16a34a', weight: 6 }],
    [],
  )
  const stops = useMemo(
    () =>
      ROUTE_08.stops
        .filter((s) => s.pointIndex < 10)
        .map((s) => ({ id: s.id, name: s.name, position: ROUTE_08.points[s.pointIndex], highlight: s.id === 's2' })),
    [],
  )

  return (
    <div className="flex min-h-dvh flex-col bg-white lg:h-dvh">
      <header className="sticky top-0 z-[500] flex items-center gap-3 border-b border-border bg-white/95 px-4 py-3 backdrop-blur">
        <span className="flex size-10 items-center justify-center rounded-xl bg-passenger text-white">
          <Bus className="size-5" aria-hidden="true" />
        </span>
        <div className="mr-auto">
          <p className="font-bold leading-tight">SmartBus</p>
          <p className="text-xs text-muted-foreground">Hành khách</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={false}
          onClick={onEnableAccessible}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-orange-500 px-4 text-sm font-semibold text-black hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-400/50"
        >
          <Eye className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Hỗ trợ khiếm thị</span>
          <span className="sm:hidden">Hỗ trợ</span>
        </button>
        <RoleSwitchButton />
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="order-2 flex flex-col gap-6 p-4 lg:order-1 lg:w-[420px] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-border">
          <TripSearch onSearch={setDestination} />
          {destination ? (
            <TripResults destination={destination} onClose={() => setDestination(null)} />
          ) : (
            <>
              <NearbyArrivals />
              <FavoriteRoutes />
            </>
          )}
        </div>
        <section aria-label="Bản đồ xe buýt" className="relative order-1 h-64 lg:order-2 lg:h-auto lg:flex-1">
          <BusMap
            segments={segments}
            stops={stops}
            bus={pointAt(ROUTE_08.points, 2.4)}
            busColor="#16a34a"
            user={USER_LOCATION}
            className="absolute inset-0"
          />
        </section>
      </div>
    </div>
  )
}
