import { NextRequest, NextResponse } from 'next/server'
import { removeUser, getList } from '@/lib/presence-store'

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
