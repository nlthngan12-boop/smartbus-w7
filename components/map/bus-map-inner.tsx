'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import type { LatLng } from '@/lib/route-data'

export type MapSegment = {
  positions: LatLng[]
  color: string
  weight?: number
  opacity?: number
}

export type MapStop = {
  id: string
  name: string
  position: LatLng
  highlight?: boolean
}

export type BusMapProps = {
  segments: MapSegment[]
  stops: MapStop[]
  bus?: LatLng
  busColor?: string
  user?: LatLng
  follow?: boolean
  zoom?: number
  className?: string
}

const BUS_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>'

function busIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:40px;height:40px;border-radius:9999px;background:${color};display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,.3)">${BUS_SVG}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

const userIcon = L.divIcon({
  className: '',
  html: '<div style="width:20px;height:20px;border-radius:9999px;background:#2563eb;border:4px solid white;box-shadow:0 0 0 6px rgba(37,99,235,.25)"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function FollowController({ target, follow }: { target?: LatLng; follow?: boolean }) {
  const map = useMap()
  const lat = target?.[0]
  const lng = target?.[1]
  useEffect(() => {
    if (follow && lat !== undefined && lng !== undefined) {
      map.panTo([lat, lng], { animate: true, duration: 0.8 })
    }
  }, [follow, lat, lng, map])
  return null
}

export function BusMapInner({
  segments,
  stops,
  bus,
  busColor = '#1d4ed8',
  user,
  follow,
  zoom = 14,
  className,
}: BusMapProps) {
  const icon = useMemo(() => busIcon(busColor), [busColor])
  const allPoints = useMemo(() => segments.flatMap((s) => s.positions), [segments])
  const [initialBounds] = useState(() => L.latLngBounds(allPoints.map((p) => L.latLng(p[0], p[1]))))
  const center = follow ? bus : undefined

  return (
    <div className={className}>
      <MapContainer
        {...(center ? { center, zoom } : { bounds: initialBounds, boundsOptions: { padding: [24, 24] } })}
        scrollWheelZoom
        zoomControl={false}
        attributionControl
        className="size-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={allPoints} pathOptions={{ color: '#ffffff', weight: 12, opacity: 0.9 }} />
        {segments.map((s, i) => (
          <Polyline
            key={i}
            positions={s.positions}
            pathOptions={{ color: s.color, weight: s.weight ?? 7, opacity: s.opacity ?? 1, lineCap: 'round' }}
          />
        ))}
        {stops.map((stop) => (
          <CircleMarker
            key={stop.id}
            center={stop.position}
            radius={stop.highlight ? 9 : 6}
            pathOptions={{
              color: stop.highlight ? '#1d4ed8' : '#334155',
              weight: 3,
              fillColor: '#ffffff',
              fillOpacity: 1,
            }}
          >
            <Tooltip direction="top" offset={[0, -6]} permanent={stop.highlight}>
              {stop.name}
            </Tooltip>
          </CircleMarker>
        ))}
        {user && <Marker position={user} icon={userIcon} />}
        {bus && <Marker position={bus} icon={icon} zIndexOffset={1000} />}
        <FollowController target={bus} follow={follow} />
      </MapContainer>
    </div>
  )
}
