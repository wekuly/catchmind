import { getList, subscribe } from '@/lib/presence-store'

export const dynamic = 'force-dynamic'

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
