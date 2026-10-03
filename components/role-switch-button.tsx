import Link from 'next/link'
import { ArrowLeftRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RoleSwitchButton({
  className,
  variant = 'light',
}: {
  className?: string
  variant?: 'light' | 'onColor' | 'large'
}) {
  return (
    <Link
      href="/"
      aria-label="Đổi vai trò – quay lại màn hình Bạn là ai?"
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4',
        variant === 'light' && 'h-10 border border-border bg-white px-4 text-sm text-foreground hover:bg-muted focus-visible:ring-ring/40',
        variant === 'onColor' && 'h-10 bg-white/15 px-4 text-sm text-white ring-1 ring-white/30 hover:bg-white/25 focus-visible:ring-white/60',
        variant === 'large' && 'h-16 border-4 border-foreground bg-white px-6 text-xl text-foreground hover:bg-muted focus-visible:ring-foreground/40',
        className,
      )}
    >
      <ArrowLeftRight className={variant === 'large' ? 'size-7' : 'size-4'} aria-hidden="true" />
      Bạn là ai?
    </Link>
  )
}
