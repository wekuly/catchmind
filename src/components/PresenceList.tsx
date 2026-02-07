'use client'

import { useEffect, useState } from 'react'
import './PresenceList.css'

type PresenceUser = { id: string; name: string; joinedAt: number }

const STORAGE_KEY = 'catchmind-presence-id'

function generateId(): string {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function getOrCreateId(): string {
  if (typeof window === 'undefined') return ''
  let id = sessionStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = generateId()
    sessionStorage.setItem(STORAGE_KEY, id)
  }
  return id
}

export default function PresenceList() {
  const [list, setList] = useState<PresenceUser[]>([])
  const [myId, setMyId] = useState<string | null>(null)

  useEffect(() => {
    const id = getOrCreateId()
    setMyId(id)
    const name = `접속자 ${id.slice(0, 6)}`

    fetch('/api/presence/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.list)) setList(data.list)
      })
      .catch(console.error)

    const eventSource = new EventSource('/api/presence/stream')
    eventSource.onmessage = (e) => {
      try {
        const next = JSON.parse(e.data) as PresenceUser[]
        if (Array.isArray(next)) setList(next)
      } catch {
        // SSE 데이터 파싱 실패 시 무시
      }
    }
    eventSource.onerror = () => eventSource.close()

    const handleLeave = () => {
      fetch('/api/presence/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
        keepalive: true,
      }).catch(() => { })
    }

    const handleBeforeUnload = () => {
      navigator.sendBeacon(
        '/api/presence/leave',
        new Blob([JSON.stringify({ id })], { type: 'application/json' })
      )
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pagehide', handleLeave)

    return () => {
      eventSource.close()
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pagehide', handleLeave)
      handleLeave()
    }
  }, [])

  return (
    <aside className="presence-list">
      <h3 className="presence-list__title">접속자 목록 ({list.length}명)</h3>
      <ul className="presence-list__items">
        {list.map((user) => (
          <li
            key={user.id}
            className={`presence-list__item ${user.id === myId ? 'presence-list__item--me' : ''}`}
          >
            <span className="presence-list__name">{user.name}</span>
            {user.id === myId && <span className="presence-list__badge">나</span>}
          </li>
        ))}
      </ul>
    </aside>
  )
}
