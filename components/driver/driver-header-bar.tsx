'use client'

import { useEffect, useState } from 'react'
import { BusFront, Camera, LogOut, Satellite, UserRound } from 'lucide-react'
import { logoutDriver } from '@/app/actions/driver'
import type { DriverProfile } from '@/lib/driver-auth'
import { RoleSwitchButton } from '@/components/role-switch-button'
import { cn } from '@/lib/utils'

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function scheduleStatus(deviationSec: number) {
  const minutes = Math.round(Math.abs(deviationSec) / 60)
  if (minutes === 0) return { label: 'Đúng giờ', className: 'bg-green-500 text-white' }
  if (deviationSec > 0) return { label: `Trễ ${minutes} phút`, className: minutes >= 3 ? 'bg-red-500 text-white' : 'bg-yellow-400 text-black' }
  return { label: `Sớm ${minutes} phút`, className: 'bg-sky-300 text-black' }
}

function StatusLight({ icon: Icon, label }: { icon: typeof Satellite; label: string }) {
  return (
    <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium">
      <span className="relative flex size-2.5" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex size-2.5 rounded-full bg-green-400" />
      </span>
      <Icon className="size-4" aria-hidden="true" />
      <span>{label}</span>
      <span className="sr-only">: đang kết nối ổn định</span>
    </span>
  )
}

export function DriverHeaderBar({ driver, deviationSec }: { driver: DriverProfile; deviationSec: number }) {
  const now = useClock()
  const status = scheduleStatus(deviationSec)

  return (
    <header className="bg-driver-deep text-white">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex size-12 flex-col items-center justify-center rounded-xl bg-white text-driver-deep">
            <span className="text-[10px] font-semibold leading-none">TUYẾN</span>
            <span className="text-xl font-extrabold leading-none">{driver.routeNumber}</span>
          </span>
          <div>
            <p className="flex items-center gap-1.5 text-lg font-bold leading-tight">
              <BusFront className="size-5" aria-hidden="true" />
              Xe {driver.plate}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-white/75">
              <UserRound className="size-3.5" aria-hidden="true" />
              {driver.displayName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2" aria-label="Trạng thái kết nối">
          <StatusLight icon={Satellite} label="GPS" />
          <StatusLight icon={Camera} label="Camera AI" />
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <div
            className={cn('rounded-lg px-3 py-1.5 text-sm font-bold', status.className)}
            role="status"
            aria-label={`Tiến độ lịch trình: ${status.label}`}
          >
            {status.label}
          </div>
          <time className="min-w-[96px] text-right font-mono text-2xl font-bold tabular-nums" suppressHydrationWarning>
            {now ? now.toLocaleTimeString('vi-VN', { hour12: false }) : '--:--:--'}
          </time>
          <RoleSwitchButton variant="onColor" />
          <form action={logoutDriver}>
            <button
              type="submit"
              aria-label="Đăng xuất"
              className="flex size-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
            >
              <LogOut className="size-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
