import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'driver_session'

export type DriverProfile = {
  id: string
  displayName: string
  routeNumber: string
  plate: string
}

const DRIVERS: Record<string, DriverProfile> = {
  OPCD: { id: 'OPCD', displayName: 'Tài xế OPCD', routeNumber: '08', plate: '51B-12345' },
}

const ACCOUNTS = [{ username: 'busapp', password: 'oisp2026', driverId: 'OPCD' }]

export function verifyDriverCredentials(username: string, password: string) {
  const account = ACCOUNTS.find((a) => a.username === username && a.password === password)
  return account ? DRIVERS[account.driverId] : undefined
}

export async function getDriverSession(): Promise<DriverProfile | undefined> {
  const store = await cookies()
  const id = store.get(SESSION_COOKIE)?.value
  return id ? DRIVERS[id] : undefined
}
