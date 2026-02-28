/**
 * presence-store.ts
 * 접속자(presence) 목록을 메모리에서 관리하고, SSE 구독자에게 변경 시 알립니다.
 * API 라우트(join, leave, stream)에서 import해 사용합니다.
 * 참고: 서버 재시작 시 목록은 비워지며, 다중 인스턴스 환경에서는 Redis 등 외부 저장소가 필요합니다.
 */

/** 접속자 한 명의 타입 (lastSeen: 마지막 heartbeat 시각) */
export type PresenceUser = {
  id: string
  name: string
  joinedAt: number
  lastSeen: number
}

/** 접속자 목록: id -> PresenceUser */
const presenceList = new Map<string, PresenceUser>()

/** SSE 스트림 구독자: 목록이 바뀔 때마다 호출될 콜백들의 집합 */
const subscribers = new Set<(_users: PresenceUser[]) => void>()

/**
 * 현재 목록을 가져와 모든 구독자에게 전달합니다.
 * addUser/removeUser 호출 시 내부에서 사용됩니다.
 */
function notifySubscribers() {
  const list = getList()
  subscribers.forEach((cb) => cb(list))
}

/**
 * 접속자 추가. 동일 id가 있으면 덮어씁니다.
 * joinedAt, lastSeen을 현재 시각으로 설정합니다.
 */
export function addUser(id: string, name: string) {
  const now = Date.now()
  presenceList.set(id, { id, name, joinedAt: now, lastSeen: now })
  notifySubscribers()
}

/**
 * 마지막 접속 시각 갱신(heartbeat). 탭 유지 시 주기적으로 호출합니다.
 */
export function updateLastSeen(id: string) {
  const user = presenceList.get(id)
  if (user) {
    user.lastSeen = Date.now()
  }
}

/**
 * 접속자 제거(명시적 퇴장).
 * 호출 후 구독자들에게 새 목록이 전송됩니다.
 */
export function removeUser(id: string) {
  presenceList.delete(id)
  notifySubscribers()
}

/**
 * 현재 접속자 목록을 배열로 반환합니다.
 */
export function getList(): PresenceUser[] {
  return Array.from(presenceList.values())
}

/**
 * 목록이 변경될 때마다 호출될 콜백을 등록합니다.
 * @returns 구독 해제 함수 (스트림 취소 시 호출)
 */
export function subscribe(callback: (_users: PresenceUser[]) => void): () => void {
  subscribers.add(callback)
  return () => subscribers.delete(callback)
}
