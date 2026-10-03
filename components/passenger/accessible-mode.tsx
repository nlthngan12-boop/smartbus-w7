'use client'

import { useEffect, useState } from 'react'
import { EyeOff, House, Navigation, Phone, Star, Volume2 } from 'lucide-react'
import { useSpeech } from '@/lib/use-speech'
import { HOME_GUIDANCE } from '@/lib/passenger-data'
import { RoleSwitchButton } from '@/components/role-switch-button'
import { BigButton } from './accessible/ui'
import { FavoritesView } from './accessible/favorites-view'
import { HomeView } from './accessible/home-view'
import { NavigateView } from './accessible/navigate-view'
import { ContactsView } from './accessible/contacts-view'

type View = 'menu' | 'favorites' | 'home' | 'navigate' | 'contacts'

const MENU_INTRO =
  'Chế độ hỗ trợ khiếm thị đã bật. Có 6 nút lớn. Nút vàng: lộ trình yêu thích. Nút xanh lá: về nhà. Nút xanh dương: dẫn đường. Nút tím: trợ giúp, nghe lại. Nút đỏ: gọi hỗ trợ. Nút cam: tắt chế độ hỗ trợ.'

export function AccessibleMode({ onExit }: { onExit: () => void }) {
  const speech = useSpeech()
  const [view, setView] = useState<View>('menu')
  const { speak } = speech

  useEffect(() => {
    speak(MENU_INTRO)
  }, [speak])

  function backToMenu() {
    setView('menu')
    speak('Menu chính. ' + MENU_INTRO.split('. ').slice(1).join('. '))
  }

  function repeat() {
    speak(speech.lastMessage || MENU_INTRO)
  }

  return (
    <main className="flex min-h-dvh flex-col gap-4 bg-white p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-3 text-2xl font-extrabold">
          <Volume2 className="size-9 text-purple-700" strokeWidth={2.6} aria-hidden="true" />
          <span>SmartBus</span>
        </p>
        <RoleSwitchButton variant="large" />
      </div>

      <p aria-live="polite" className="sr-only">
        {speech.lastMessage}
      </p>

      {view === 'menu' && (
        <div className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-3">
          <BigButton icon={Star} label="Lộ trình yêu thích" tone="yellow" onClick={() => setView('favorites')} />
          <BigButton
            icon={House}
            label="Về nhà"
            tone="green"
            onClick={() => {
              setView('home')
              speak(HOME_GUIDANCE)
            }}
          />
          <BigButton icon={Navigation} label="Dẫn đường" tone="blue" onClick={() => setView('navigate')} />
          <BigButton icon={Volume2} label="Trợ giúp" tone="purple" onClick={repeat} />
          <BigButton icon={Phone} label="Gọi hỗ trợ" tone="red" onClick={() => setView('contacts')} />
          <BigButton
            icon={EyeOff}
            label="Tắt hỗ trợ"
            tone="orange"
            onClick={onExit}
          />
        </div>
      )}

      {view === 'favorites' && <FavoritesView speech={speech} onBack={backToMenu} onRepeat={repeat} />}
      {view === 'home' && <HomeView onBack={backToMenu} onRepeat={repeat} />}
      {view === 'navigate' && <NavigateView speech={speech} onBack={backToMenu} onRepeat={repeat} />}
      {view === 'contacts' && <ContactsView speech={speech} onBack={backToMenu} onRepeat={repeat} />}
    </main>
  )
}
