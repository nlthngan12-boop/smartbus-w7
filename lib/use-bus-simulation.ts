'use client'

import { useEffect, useState } from 'react'
import { ROUTE_08, type TrafficLevel } from '@/lib/route-data'

const SEGMENT_COUNT = ROUTE_08.points.length - 1
const INITIAL_TRAFFIC: TrafficLevel[] = [
  'clear', 'busy', 'jam', 'busy', 'clear', 'busy', 'clear', 'clear',
  'busy', 'jam', 'busy', 'clear', 'clear', 'busy', 'clear', 'clear',
].slice(0, SEGMENT_COUNT) as TrafficLevel[]

const SPEED: Record<TrafficLevel, number> = { clear: 0.06, busy: 0.035, jam: 0.012 }
const DRIFT: Record<TrafficLevel, number> = { clear: -3, busy: 1, jam: 6 }

function nextLevel(level: TrafficLevel): TrafficLevel {
  const r = Math.random()
  if (level === 'clear') return r < 0.75 ? 'clear' : 'busy'
  if (level === 'busy') return r < 0.5 ? 'busy' : r < 0.8 ? 'clear' : 'jam'
  return r < 0.6 ? 'jam' : 'busy'
}

type SimState = { progress: number; deviationSec: number; traffic: TrafficLevel[]; tick: number }

export function useBusSimulation() {
  const [state, setState] = useState<SimState>({
    progress: 1.3,
    deviationSec: -60,
    traffic: INITIAL_TRAFFIC,
    tick: 0,
  })

  useEffect(() => {
    const id = setInterval(() => {
      setState((s) => {
        const level = s.traffic[Math.min(Math.floor(s.progress), SEGMENT_COUNT - 1)]
        const nextProgress = s.progress + SPEED[level]
        const tick = s.tick + 1
        return {
          tick,
          progress: nextProgress >= SEGMENT_COUNT ? 0 : nextProgress,
          deviationSec: Math.max(-120, Math.min(300, s.deviationSec + DRIFT[level])),
          traffic: tick % 8 === 0 ? s.traffic.map((l) => (Math.random() < 0.25 ? nextLevel(l) : l)) : s.traffic,
        }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return state
}
