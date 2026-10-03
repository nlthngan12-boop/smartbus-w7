import { PassengerApp } from '@/components/passenger/passenger-app'

export const metadata = { title: 'Hành khách – SmartBus' }

export default async function PassengerPage({ searchParams }: { searchParams: Promise<{ hotro?: string }> }) {
  const { hotro } = await searchParams
  return <PassengerApp initialAccessible={hotro === '1'} />
}
