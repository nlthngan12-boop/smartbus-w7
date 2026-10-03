'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Bus, ChevronRight, Eye, BusFront, Users, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSpeech } from '@/lib/use-speech'

const GUIDE =
  'Bạn là ai? Nút màu xanh lá phía trên dành cho Hành khách. Nút màu xanh dương phía dưới dành cho Tài xế. Nút màu cam ở cuối màn hình để bật chế độ hỗ trợ người khiếm thị.'

export function RoleSelect() {
  const [accessible, setAccessible] = useState(false)
  const { speak } = useSpeech()

  function toggleAccessible() {
    const next = !accessible
    setAccessible(next)
    speak(
      next
        ? 'Đã bật chế độ hỗ trợ người khiếm thị. Chạm vào nút màu xanh lá lớn phía trên để vào phần Hành khách.'
        : 'Đã tắt chế độ hỗ trợ người khiếm thị.',
    )
  }

  return (
    <main className="flex min-h-dvh flex-col items-center bg-white px-5 py-10">
      <div className="flex w-full max-w-xl flex-1 flex-col">
        <header className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-passenger text-white">
            <Bus className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-lg font-bold leading-tight">SmartBus</p>
            <p className="text-sm text-muted-foreground">Xe buýt thông minh cho mọi người</p>
          </div>
          <button
            type="button"
            onClick={() => speak(GUIDE)}
            className="ml-auto inline-flex h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
          >
            <Volume2 className="size-5" aria-hidden="true" />
            Nghe hướng dẫn
          </button>
        </header>

        <section className="mt-12 text-center" aria-labelledby="who-title">
          <h1 id="who-title" className={cn('text-balance font-extrabold tracking-tight', accessible ? 'text-5xl' : 'text-4xl')}>
            Bạn là ai?
          </h1>
          <p className={cn('mt-3 text-pretty text-muted-foreground', accessible ? 'text-xl' : 'text-base')}>
            Chọn vai trò để tiếp tục. Bạn có thể đổi lại bất cứ lúc nào bằng nút &quot;Bạn là ai?&quot;.
          </p>
        </section>

        <nav aria-label="Chọn vai trò" className="mt-10 flex flex-col gap-5">
          <Link
            href={accessible ? '/hanh-khach?hotro=1' : '/hanh-khach'}
            className={cn(
              'group flex items-center gap-5 rounded-3xl border-2 border-passenger bg-passenger-soft p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-passenger/40',
              accessible && 'min-h-44 p-8',
            )}
          >
            <span className={cn('flex shrink-0 items-center justify-center rounded-2xl bg-passenger text-white', accessible ? 'size-24' : 'size-16')}>
              <Users className={accessible ? 'size-14' : 'size-9'} aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className={cn('block font-bold text-passenger', accessible ? 'text-4xl' : 'text-2xl')}>Hành khách</span>
              {!accessible && (
                <span className="mt-1 block text-sm text-muted-foreground">
                  Tìm đường, xem xe sắp đến, lộ trình yêu thích và chế độ hỗ trợ khiếm thị
                </span>
              )}
            </span>
            <ChevronRight className="size-7 text-passenger transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>

          <Link
            href="/tai-xe/dang-nhap"
            className={cn(
              'group flex items-center gap-5 rounded-3xl border-2 border-driver bg-driver-soft p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-driver/40',
              accessible && 'min-h-44 p-8',
            )}
          >
            <span className={cn('flex shrink-0 items-center justify-center rounded-2xl bg-driver text-white', accessible ? 'size-24' : 'size-16')}>
              <BusFront className={accessible ? 'size-14' : 'size-9'} aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className={cn('block font-bold text-driver', accessible ? 'text-4xl' : 'text-2xl')}>Tài xế</span>
              {!accessible && (
                <span className="mt-1 block text-sm text-muted-foreground">
                  Đăng nhập để xem lộ trình, giao thông thời gian thực và báo sự cố
                </span>
              )}
            </span>
            <ChevronRight className="size-7 text-driver transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </nav>

        <div className="mt-auto pt-10">
          <button
            type="button"
            role="switch"
            aria-checked={accessible}
            onClick={toggleAccessible}
            className={cn(
              'flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-400/50',
              accessible ? 'border-orange-500 bg-orange-500 text-black' : 'border-orange-300 bg-orange-50 text-foreground',
            )}
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600">
              <Eye className="size-7" aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className="block text-lg font-bold">Chế độ hỗ trợ người khiếm thị</span>
              <span className="block text-sm opacity-80">{accessible ? 'Đang bật – chữ và nút cỡ lớn' : 'Chạm để bật'}</span>
            </span>
            <span
              aria-hidden="true"
              className={cn('relative h-8 w-14 shrink-0 rounded-full transition-colors', accessible ? 'bg-black' : 'bg-orange-200')}
            >
              <span className={cn('absolute top-1 size-6 rounded-full bg-white shadow transition-all', accessible ? 'left-7' : 'left-1')} />
            </span>
          </button>
        </div>
      </div>
    </main>
  )
}
