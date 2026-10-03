import type { LatLng } from '@/lib/route-data'

export const USER_LOCATION: LatLng = [10.7626, 106.6822]

export type Arrival = {
  route: string
  color: string
  headsign: string
  stop: string
  minutes: number
  walkMinutes: number
  crowd: 'low' | 'medium' | 'high'
}

export const NEARBY_ARRIVALS: Arrival[] = [
  { route: '08', color: '#16a34a', headsign: 'ĐH Quốc gia', stop: 'Trạm Trần Hưng Đạo', minutes: 3, walkMinutes: 2, crowd: 'low' },
  { route: '19', color: '#0284c7', headsign: 'Bến Thành – KCX Linh Trung', stop: 'Trạm Nguyễn Văn Cừ', minutes: 7, walkMinutes: 4, crowd: 'medium' },
  { route: '56', color: '#ea580c', headsign: 'Chợ Lớn – ĐH GTVT', stop: 'Trạm Trần Hưng Đạo', minutes: 11, walkMinutes: 2, crowd: 'high' },
  { route: '01', color: '#7c3aed', headsign: 'Bến Thành – BX Chợ Lớn', stop: 'Trạm Nguyễn Văn Cừ', minutes: 14, walkMinutes: 4, crowd: 'low' },
]

export type FavoriteRoute = {
  id: string
  route: string
  color: string
  from: string
  to: string
  minutes: number
  nextBus: number
  stop: string
}

export const FAVORITE_ROUTES: FavoriteRoute[] = [
  { id: 'f1', route: '08', color: '#16a34a', from: 'Nhà', to: 'Trường ĐH Quốc gia', minutes: 45, nextBus: 3, stop: 'Trần Hưng Đạo' },
  { id: 'f2', route: '19', color: '#0284c7', from: 'Nhà', to: 'Chợ Bến Thành', minutes: 20, nextBus: 7, stop: 'Nguyễn Văn Cừ' },
  { id: 'f3', route: '56', color: '#ea580c', from: 'Nhà', to: 'Bệnh viện Chợ Rẫy', minutes: 25, nextBus: 11, stop: 'Trần Hưng Đạo' },
]

export const SAVED_PLACES = [
  { id: 'home', label: 'Nhà', address: '227 Nguyễn Văn Cừ, Quận 5' },
  { id: 'work', label: 'Công ty', address: '45 Lê Duẩn, Quận 1' },
  { id: 'school', label: 'Trường', address: 'Khu phố 6, Linh Trung, Thủ Đức' },
]

export const HOME_GUIDANCE =
  'Đường về nhà. Đi bộ 150 mét về phía bên phải đến trạm Thảo Cầm Viên. Đón xe buýt số 19 hướng Bến Thành. Xe sẽ đến sau 6 phút. Xuống xe tại trạm Nguyễn Văn Cừ, sau 7 trạm. Đi bộ thêm 80 mét là đến nhà. Tổng thời gian khoảng 28 phút.'

export function buildDestinationGuidance(destination: string) {
  return `Dẫn đường đến ${destination}. Đi bộ 200 mét thẳng phía trước đến trạm Trần Hưng Đạo. Đón xe buýt số 08. Xe sẽ đến sau 3 phút. Hệ thống sẽ báo bằng âm thanh khi xe đến gần và trước khi tới trạm cần xuống.`
}

export function buildFavoriteGuidance(index: number, fav: FavoriteRoute) {
  return `Đã chọn lộ trình số ${index}: từ ${fav.from} đến ${fav.to}. Đi bộ đến trạm ${fav.stop}, đón xe buýt số ${fav.route}. Xe sẽ đến sau ${fav.nextBus} phút. Thời gian đi khoảng ${fav.minutes} phút.`
}
