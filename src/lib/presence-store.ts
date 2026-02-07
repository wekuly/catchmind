export type PresenceUser = {
  id: string
  name: string
  joinedAt: number
}

const presenceList = new Map<string, PresenceUser>()
const subscribers = new Set<(_users: PresenceUser[]) => void>()

function notifySubscribers() {
  const list = getList()
  subscribers.forEach((cb) => cb(list))
}

export function addUser(id: string, name: string) {
  presenceList.set(id, { id, name, joinedAt: Date.now() })
  notifySubscribers()
}

export function removeUser(id: string) {
  presenceList.delete(id)
  notifySubscribers()
}

export function getList(): PresenceUser[] {
  return Array.from(presenceList.values())
}

export function subscribe(callback: (_users: PresenceUser[]) => void): () => void {
  subscribers.add(callback)
  return () => subscribers.delete(callback)
}
