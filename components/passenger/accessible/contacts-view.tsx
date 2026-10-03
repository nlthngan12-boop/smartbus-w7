'use client'

import { useEffect, useState } from 'react'
import { Headset, Phone, Plus, Trash2, UserRound } from 'lucide-react'
import type { useSpeech } from '@/lib/use-speech'
import { ScreenHeader } from './ui'

type Contact = { id: string; name: string; phone: string }

const STORAGE_KEY = 'smartbus-relatives'
const HOTLINE: Contact = { id: 'hotline', name: 'Tổng đài xe buýt', phone: '1022' }

function loadContacts(): Contact[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Contact[]) : []
  } catch {
    return []
  }
}

export function ContactsView({
  speech,
  onBack,
  onRepeat,
}: {
  speech: ReturnType<typeof useSpeech>
  onBack: () => void
  onRepeat: () => void
}) {
  const [contacts, setContacts] = useState<Contact[]>(loadContacts)
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const { speak } = speech

  useEffect(() => {
    const names = contacts.map((c, i) => `Nút số ${i + 2}: ${c.name}`).join('. ')
    speak(
      `Gọi hỗ trợ. Nút số 1: tổng đài xe buýt. ${names ? names + '.' : 'Chưa lưu số người thân.'} Chạm vào nút để gọi.`,
    )
    // Announce only once when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speak])

  function save(next: Contact[]) {
    setContacts(next)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  function addContact(e: React.FormEvent) {
    e.preventDefault()
    const cleanPhone = phone.replace(/[^\d+]/g, '')
    if (!name.trim() || cleanPhone.length < 3) {
      speak('Vui lòng nhập tên và số điện thoại hợp lệ.')
      return
    }
    save([...contacts, { id: crypto.randomUUID(), name: name.trim(), phone: cleanPhone }])
    speak(`Đã lưu số của ${name.trim()}.`)
    setName('')
    setPhone('')
    setAdding(false)
  }

  const all = [HOTLINE, ...contacts]

  return (
    <div className="flex flex-1 flex-col gap-4">
      <ScreenHeader icon={Phone} title="Gọi hỗ trợ" tone="red" onBack={onBack} onRepeat={onRepeat} />

      <ul className="grid gap-4 sm:grid-cols-2">
        {all.map((c, i) => (
          <li key={c.id} className="flex gap-3">
            <a
              href={`tel:${c.phone}`}
              onClick={() => speak(`Đang gọi ${c.name}.`)}
              aria-label={`Gọi ${c.name}, số ${c.phone.split('').join(' ')}`}
              className={`flex min-h-32 flex-1 items-center gap-4 rounded-3xl p-5 shadow-md focus-visible:outline-none focus-visible:ring-8 ${
                i === 0 ? 'bg-red-600 text-white focus-visible:ring-red-900' : 'bg-green-600 text-white focus-visible:ring-green-900'
              }`}
            >
              <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-white text-black">
                {i === 0 ? <Headset className="size-10" aria-hidden="true" /> : <UserRound className="size-10" aria-hidden="true" />}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-2xl font-extrabold">{c.name}</span>
                <span className="text-2xl font-bold tabular-nums tracking-wide">{c.phone}</span>
              </span>
              <Phone className="ml-auto size-12 shrink-0" strokeWidth={2.6} aria-hidden="true" />
            </a>
            {i > 0 && (
              <button
                type="button"
                onClick={() => {
                  save(contacts.filter((x) => x.id !== c.id))
                  speak(`Đã xóa ${c.name}.`)
                }}
                aria-label={`Xóa ${c.name}`}
                className="flex w-20 shrink-0 items-center justify-center rounded-3xl border-4 border-foreground bg-white focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-foreground/30"
              >
                <Trash2 className="size-9" aria-hidden="true" />
              </button>
            )}
          </li>
        ))}
      </ul>

      {adding ? (
        <form onSubmit={addContact} className="flex flex-col gap-3 rounded-3xl border-4 border-foreground p-4">
          <label className="flex flex-col gap-1">
            <span className="text-xl font-bold">Tên người thân</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="h-16 rounded-2xl border-4 border-foreground px-4 text-2xl font-bold outline-none focus-visible:ring-8 focus-visible:ring-purple-700/40"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xl font-bold">Số điện thoại</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className="h-16 rounded-2xl border-4 border-foreground px-4 text-3xl font-bold tabular-nums tracking-wider outline-none focus-visible:ring-8 focus-visible:ring-purple-700/40"
            />
          </label>
          <button
            type="submit"
            className="h-20 rounded-3xl bg-green-600 text-2xl font-extrabold text-white focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-green-900"
          >
            Lưu số
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => {
            setAdding(true)
            speak('Thêm người thân. Nhập tên và số điện thoại, sau đó nhấn nút Lưu số màu xanh lá.')
          }}
          className="flex h-24 items-center justify-center gap-3 rounded-3xl bg-purple-700 text-2xl font-extrabold text-white focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-purple-950"
        >
          <Plus className="size-10" strokeWidth={3} aria-hidden="true" />
          Thêm người thân
        </button>
      )}
    </div>
  )
}
