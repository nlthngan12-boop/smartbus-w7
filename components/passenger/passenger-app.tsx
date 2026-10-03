'use client'

import { useState } from 'react'
import { AccessibleMode } from './accessible-mode'
import { StandardMode } from './standard-mode'

export function PassengerApp({ initialAccessible }: { initialAccessible: boolean }) {
  const [accessible, setAccessible] = useState(initialAccessible)

  return accessible ? (
    <AccessibleMode onExit={() => setAccessible(false)} />
  ) : (
    <StandardMode onEnableAccessible={() => setAccessible(true)} />
  )
}
