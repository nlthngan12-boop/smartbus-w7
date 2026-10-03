import { Bus, Footprints, House, MapPin } from 'lucide-react'
import { ScreenHeader } from './ui'

const STEPS = [
  { icon: Footprints, big: '150m', tone: 'bg-yellow-400 text-black', label: 'Đi bộ đến trạm' },
  { icon: Bus, big: '19', tone: 'bg-blue-700 text-white', label: 'Đến sau 6 phút' },
  { icon: MapPin, big: '7', tone: 'bg-orange-500 text-black', label: 'trạm thì xuống' },
  { icon: House, big: '80m', tone: 'bg-green-600 text-white', label: 'Đi bộ về nhà' },
]

export function HomeView({ onBack, onRepeat }: { onBack: () => void; onRepeat: () => void }) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <ScreenHeader icon={House} title="Về nhà" tone="green" onBack={onBack} onRepeat={onRepeat} />
      <ol className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Các bước về nhà">
        {STEPS.map((s, i) => (
          <li key={s.label} className={`flex flex-col items-center justify-center gap-2 rounded-3xl p-4 text-center shadow-md ${s.tone}`}>
            <span className="text-lg font-bold opacity-80">Bước {i + 1}</span>
            <s.icon className="size-16" strokeWidth={2.4} aria-hidden="true" />
            <span className="text-5xl font-black tabular-nums">{s.big}</span>
            <span className="text-xl font-bold">{s.label}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
