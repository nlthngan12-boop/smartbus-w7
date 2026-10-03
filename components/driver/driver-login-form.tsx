'use client'

import { useActionState, useState } from 'react'
import { Eye, EyeOff, Info, Loader2, Lock, User } from 'lucide-react'
import { loginDriver, type LoginState } from '@/app/actions/driver'

export function DriverLoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginDriver, {})
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-semibold">
          Tên đăng nhập
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="username"
            name="username"
            autoComplete="username"
            defaultValue={state.username}
            placeholder="Nhập tên đăng nhập"
            className="h-12 w-full rounded-xl border border-input bg-white pl-11 pr-4 text-base outline-none transition focus:border-driver focus:ring-4 focus:ring-driver/15"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold">
          Mật khẩu
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Nhập mật khẩu"
            className="h-12 w-full rounded-xl border border-input bg-white pl-11 pr-12 text-base outline-none transition focus:border-driver focus:ring-4 focus:ring-driver/15"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-driver text-base font-semibold text-white transition hover:bg-driver-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-driver/30 disabled:opacity-70"
      >
        {pending && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
        {pending ? 'Đang xác thực...' : 'Đăng nhập'}
      </button>

      <div className="mt-2 flex gap-3 rounded-xl bg-driver-soft p-4 text-sm text-driver-deep">
        <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <p>
          Tài khoản thử nghiệm: <strong>busapp</strong> / <strong>oisp2026</strong>
        </p>
      </div>
    </form>
  )
}
