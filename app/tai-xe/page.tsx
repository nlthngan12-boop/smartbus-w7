import { redirect } from 'next/navigation'
import { getDriverSession } from '@/lib/driver-auth'
import { DriverDashboard } from '@/components/driver/driver-dashboard'

export const metadata = { title: 'Bảng điều khiển tài xế – SmartBus' }

export default async function DriverPage() {
  const driver = await getDriverSession()
  if (!driver) redirect('/tai-xe/dang-nhap')
  return <DriverDashboard driver={driver} />
}
