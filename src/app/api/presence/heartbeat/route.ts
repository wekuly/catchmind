/**
 * route.ts (API: /api/presence/heartbeat)
 * POST /api/presence/heartbeat: 접속 유지 신호(heartbeat)를 보냅니다.
 * 클라이언트가 주기적으로 호출하면 lastSeen만 갱신합니다.
 */

import { NextRequest, NextResponse } from 'next/server'
import { updateLastSeen, getList } from '@/lib/presence-store'

/**
 * POST /api/presence/heartbeat
 * body: { id: string }
 * - id의 lastSeen 갱신 후, 현재 목록 반환
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const id = body?.id

    if (typeof id !== 'string') {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    updateLastSeen(id)
    return NextResponse.json({ list: getList() })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
