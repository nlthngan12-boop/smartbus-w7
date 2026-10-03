import { redirect } from 'next/navigation'
import { BusFront } from 'lucide-react'
import { getDriverSession } from '@/lib/driver-auth'
import { DriverLoginForm } from '@/components/driver/driver-login-form'
import { RoleSwitchButton } from '@/components/role-switch-button'

export const metadata = { title: 'Đăng nhập tài xế – SmartBus' }

export default async function DriverLoginPage() {
  if (await getDriverSession()) redirect('/tai-xe')

  return (
    <main className="flex min-h-dvh flex-col bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm font-semibold text-driver">SmartBus · Tài xế</span>
        <RoleSwitchButton />
      </div>
      <div className="flex flex-1 items-center justify-center px-5 pb-16">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-driver text-white shadow-lg shadow-driver/30">
              <BusFront className="size-9" aria-hidden="true" />
            </span>
            <h1 className="mt-5 text-2xl font-bold">Đăng nhập tài xế</h1>
            <p className="mt-2 text-sm text-muted-foreground">Xác thực danh tính trước khi bắt đầu ca chạy xe</p>
          </div>
          <DriverLoginForm />
        </div>
      </div>
    </main>
  )
}
