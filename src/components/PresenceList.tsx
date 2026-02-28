/**
 * PresenceList.tsx
 * 접속자 목록을 우측 상단에 표시하는 클라이언트 컴포넌트입니다.
 * - 마운트 시: join API로 등록, EventSource로 /api/presence/stream 구독, 15초마다 heartbeat 호출
 * - 언마운트/탭 닫기 시: leave API 호출로 목록에서 제거
 * - 접속 종료/새로고침은 leave API 호출 시에만 목록에서 제거됩니다.
 * - sessionStorage에 id를 저장해 새로고침 시에도 같은 id 유지
 */

'use client'

import { useEffect, useState } from 'react'
import './PresenceList.css'

/** 접속자 한 명의 타입 (lastSeen은 서버에서 만료 판단용, 클라이언트는 id/name/joinedAt만 사용) */
type PresenceUser = { id: string; name: string; joinedAt: number; lastSeen?: number }

/** sessionStorage에 저장할 접속자 id 키 */
const STORAGE_KEY = 'catchmind-presence-id'

/**
 * UUID 생성: crypto.randomUUID 지원 시 사용, 아니면 UUID v4 형태 문자열 생성
 */
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

/**
 * sessionStorage에서 접속자 id를 가져오거나, 없으면 새로 생성해 저장 후 반환
 * SSR 시 window 없으면 빈 문자열 반환
 */
function getOrCreateId(): string {
  if (typeof window === 'undefined') return ''
  let id = sessionStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = generateId()
    sessionStorage.setItem(STORAGE_KEY, id)
  }
  return id
}

/** 접속자 목록 컴포넌트 */
export default function PresenceList() {
  const [list, setList] = useState<PresenceUser[]>([])
  const [myId, setMyId] = useState<string | null>(null)

  useEffect(() => {
    const id = getOrCreateId()
    setMyId(id)
    const name = `접속자 ${id.slice(0, 6)}`

    /* join API로 서버에 등록, 응답의 list로 초기 목록 설정 */
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

    /* SSE로 접속자 목록 실시간 구독 */
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

    /* 주기적 heartbeat: lastSeen 갱신 (접속 유지 표시용) */
    const sendHeartbeat = () => {
      fetch('/api/presence/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      }).catch(() => { })
    }
    const heartbeatInterval = setInterval(sendHeartbeat, 15_000)

    /* leave API 호출: fetch (keepalive) */
    const handleLeave = () => {
      fetch('/api/presence/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
        keepalive: true,
      }).catch(() => { })
    }

    /* 탭/창 닫을 때 sendBeacon으로 leave 호출 (신뢰도 높음) */
    const handleBeforeUnload = () => {
      navigator.sendBeacon(
        '/api/presence/leave',
        new Blob([JSON.stringify({ id })], { type: 'application/json' })
      )
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pagehide', handleLeave)

    /* 클린업: heartbeat 중단, SSE 종료, 이벤트 제거, leave 한 번 더 호출 */
    return () => {
      clearInterval(heartbeatInterval)
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
