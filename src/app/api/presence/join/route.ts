import { NextRequest, NextResponse } from 'next/server'
import { addUser, getList } from '@/lib/presence-store'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const id = typeof body?.id === 'string' ? body.id : crypto.randomUUID()
    const name = typeof body?.name === 'string' ? body.name : `접속자 ${id.slice(0, 6)}`

    addUser(id, name)
    return NextResponse.json({ id, name, list: getList() })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
