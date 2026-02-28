/**
 * route.ts (API 루트)
 * GET /api 요청을 처리합니다.
 * API 정보 및 사용 가능한 엔드포인트 목록을 JSON으로 반환합니다.
 */

import { NextResponse } from 'next/server'

/**
 * GET /api
 * API 루트: 메시지, 버전, 엔드포인트 목록을 반환합니다.
 */
export async function GET() {
  return NextResponse.json({
    message: 'catchmind API',
    version: '1.0',
    endpoints: ['/api/hello', '/api/presence/join', '/api/presence/leave', '/api/presence/stream', '/api/presence/heartbeat'],
  })
}
