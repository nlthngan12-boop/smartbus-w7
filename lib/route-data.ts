export type LatLng = [number, number]
export type TrafficLevel = 'clear' | 'busy' | 'jam'

export const TRAFFIC_COLORS: Record<TrafficLevel, string> = {
  clear: '#16a34a',
  busy: '#eab308',
  jam: '#dc2626',
}

export const TRAFFIC_LABELS: Record<TrafficLevel, string> = {
  clear: 'Thông thoáng',
  busy: 'Đông xe',
  jam: 'Ùn tắc',
}

export type BusStop = {
  id: string
  name: string
  pointIndex: number
}

export const ROUTE_08 = {
  number: '08',
  name: 'Bến xe Quận 8 – ĐH Quốc gia',
  plate: '51B-12345',
  points: [
    [10.7408, 106.656],
    [10.7462, 106.6662],
    [10.7518, 106.6772],
    [10.757, 106.6835],
    [10.7622, 106.6868],
    [10.77, 106.6895],
    [10.7775, 106.693],
    [10.7848, 106.6965],
    [10.7915, 106.703],
    [10.8008, 106.7108],
    [10.7995, 106.7225],
    [10.803, 106.736],
    [10.812, 106.749],
    [10.8265, 106.7605],
    [10.8492, 106.7738],
    [10.8605, 106.788],
    [10.8705, 106.803],
  ] as LatLng[],
  roadNames: [
    'Phạm Thế Hiển',
    'Phạm Thế Hiển',
    'Cầu Nguyễn Văn Cừ',
    'Nguyễn Văn Cừ',
    'Nguyễn Văn Cừ',
    'Nguyễn Thị Minh Khai',
    'Hai Bà Trưng',
    'Điện Biên Phủ',
    'Điện Biên Phủ',
    'Cầu Sài Gòn',
    'Xa lộ Hà Nội',
    'Xa lộ Hà Nội',
    'Xa lộ Hà Nội',
    'Xa lộ Hà Nội',
    'Xa lộ Hà Nội',
    'Xa lộ Hà Nội',
  ],
  stops: [
    { id: 's0', name: 'Bến xe Quận 8', pointIndex: 0 },
    { id: 's1', name: 'Cầu Nguyễn Văn Cừ', pointIndex: 2 },
    { id: 's2', name: 'Trần Hưng Đạo', pointIndex: 4 },
    { id: 's3', name: 'Công viên Lê Văn Tám', pointIndex: 6 },
    { id: 's4', name: 'Thảo Cầm Viên', pointIndex: 8 },
    { id: 's5', name: 'Ngã tư Hàng Xanh', pointIndex: 9 },
    { id: 's6', name: 'Thảo Điền', pointIndex: 11 },
    { id: 's7', name: 'Bình Thái', pointIndex: 13 },
    { id: 's8', name: 'Ngã tư Thủ Đức', pointIndex: 14 },
    { id: 's9', name: 'ĐH Quốc gia', pointIndex: 16 },
  ] as BusStop[],
}

export function distanceMeters(a: LatLng, b: LatLng) {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function pointAt(points: LatLng[], progress: number): LatLng {
  const i = Math.min(Math.floor(progress), points.length - 2)
  const t = progress - i
  const [a, b] = [points[i], points[i + 1]]
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

export function distanceAlong(points: LatLng[], progress: number, toIndex: number) {
  const start = pointAt(points, progress)
  let i = Math.floor(progress) + 1
  if (i > toIndex) return 0
  let total = distanceMeters(start, points[i])
  for (; i < toIndex; i++) total += distanceMeters(points[i], points[i + 1])
  return total
}

export function formatDistance(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1).replace('.', ',')} km` : `${Math.round(m / 10) * 10} m`
}
