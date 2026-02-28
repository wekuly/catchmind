/**
 * route.ts (API: /api/presence/stream)
 * GET /api/presence/stream: Server-Sent Events(SSE)로 접속자 목록을 실시간 푸시합니다.
 * 클라이언트가 이 엔드포인트에 연결하면, 접속자 추가/제거 시마다 새 목록이 전송됩니다.
 */

import { getList, subscribe } from '@/lib/presence-store'

/** 이 라우트는 항상 동적 렌더링(캐시 없음) */
export const dynamic = 'force-dynamic'

/**
 * GET /api/presence/stream
 * ReadableStream으로 SSE 형식(data: {...}\n\n)을 보냅니다.
 * - 연결 시점의 목록을 한 번 보내고, presence-store에서 목록이 바뀔 때마다 구독자에게 전송
 * - 스트림이 취소(클라이언트 연결 끊김)되면 구독 해제하여 메모리 누수 방지
 */
export async function GET() {
  let unsubscribe: (() => void) | null = null

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      const send = (list: ReturnType<typeof getList>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(list)}\n\n`))
      }

      send(getList())
      unsubscribe = subscribe(send)
    },
    cancel() {
      unsubscribe?.()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-store, no-cache',
      Connection: 'keep-alive',
    },
  })
}
