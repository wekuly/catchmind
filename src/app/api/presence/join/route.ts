/**
 * route.ts (API: /api/presence/join)
 * POST /api/presence/join: 접속자 목록에 새 사용자를 등록합니다.
 * body에 id, name을 넘기면 해당 값으로 등록하고, 없으면 자동 생성합니다.
 */

import { NextRequest, NextResponse } from 'next/server'
import { addUser, getList } from '@/lib/presence-store'

/**
 * POST /api/presence/join
 * body: { id?: string, name?: string }
 * - 등록 후 현재 접속자 목록을 list로 함께 반환합니다.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const id = typeof body?.id === 'string' ? body.id : crypto.randomUUID()
    const name = typeof body?.name === 'string' ? body.name : `접속자 ${id.slice(0, 6)}`

    addUser(id, name)
    console.log(`[presence] 접속: id=${id}, name=${name}, 시각=${new Date().toISOString()}`)
    return NextResponse.json({ id, name, list: getList() })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
