'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, getDriverSession, verifyDriverCredentials } from '@/lib/driver-auth'

export type LoginState = { error?: string; username?: string }

export async function loginDriver(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!username || !password) {
    return { error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.', username }
  }

  const driver = verifyDriverCredentials(username, password)
  if (!driver) {
    return { error: 'Tên đăng nhập hoặc mật khẩu không đúng.', username }
  }

  const store = await cookies()
  store.set(SESSION_COOKIE, driver.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
  redirect('/tai-xe')
}

export async function logoutDriver() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  redirect('/tai-xe/dang-nhap')
}

export type AlertKind = 'incident' | 'sos'

export async function sendDriverAlert(input: { kind: AlertKind; lat: number; lng: number }) {
  const driver = await getDriverSession()
  if (!driver) return { ok: false as const, error: 'Phiên đăng nhập đã hết hạn.' }

  const lat = Number(input.lat)
  const lng = Number(input.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || (input.kind !== 'incident' && input.kind !== 'sos')) {
    return { ok: false as const, error: 'Dữ liệu không hợp lệ.' }
  }

  const ticket = `${input.kind === 'sos' ? 'SOS' : 'SC'}-${Date.now().toString().slice(-6)}`
  console.log('[v0] Driver alert received:', { ticket, driver: driver.id, ...input })

  return { ok: true as const, ticket, sentAt: new Date().toISOString() }
}
