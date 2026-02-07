import { NextRequest, NextResponse } from 'next/server'

/** GET /api/hello */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') ?? 'World'

  return NextResponse.json({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
  })
}

/** POST /api/hello */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({ received: body })
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    )
  }
}
