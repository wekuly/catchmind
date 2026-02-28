/**
 * route.ts (API: /api/presence/leave)
 * POST /api/presence/leave: 접속자 목록에서 사용자를 제거합니다.
 * body에 id가 필요하며, sendBeacon(Blob)으로 호출해도 파싱할 수 있도록 처리합니다.
 */

import { NextRequest, NextResponse } from 'next/server'
import { removeUser, getList } from '@/lib/presence-store'

/**
 * POST /api/presence/leave
 * body: { id: string } (JSON 또는 text로 전달 가능)
 * - Content-Type이 application/json이면 request.json(), 아니면 request.text() 후 JSON 파싱
 * - 탭/페이지 종료 시 sendBeacon으로 호출되는 경우를 위해 둘 다 지원합니다.
 * - 제거 후 현재 접속자 목록을 list로 반환합니다.
 */
export async function POST(request: NextRequest) {
  try {
    let body: { id?: string }
    const contentType = request.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      body = await request.json()
    } else {
      const text = await request.text()
      body = text ? JSON.parse(text) : {}
    }
    const id = body?.id

    if (typeof id !== 'string') {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    removeUser(id)
    return NextResponse.json({ list: getList() })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
