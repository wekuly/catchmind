/**
 * route.ts (API: /api/hello)
 * GET /api/hello, POST /api/hello 요청을 처리합니다.
 * GET: 쿼리 name으로 인사 메시지 반환, POST: 전달된 body를 그대로 반환합니다.
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/hello
 * 쿼리 파라미터 name(기본값: 'World')으로 인사 메시지와 타임스탬프를 반환합니다.
 * 예: /api/hello?name=catchmind
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') ?? 'World'

  return NextResponse.json({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
  })
}

/**
 * POST /api/hello
 * 요청 body(JSON)를 그대로 received 필드에 담아 반환합니다.
 * body가 유효한 JSON이 아니면 400 에러를 반환합니다.
 */
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
