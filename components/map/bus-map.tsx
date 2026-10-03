'use client'

import dynamic from 'next/dynamic'

export type { MapSegment, MapStop, BusMapProps } from './bus-map-inner'

export const BusMap = dynamic(() => import('./bus-map-inner').then((m) => m.BusMapInner), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-muted" aria-label="Đang tải bản đồ" />,
})
