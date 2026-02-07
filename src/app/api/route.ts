import { NextResponse } from 'next/server'

/** GET /api - API 루트 */
export async function GET() {
  return NextResponse.json({
    message: 'catchmind API',
    version: '1.0',
    endpoints: ['/api/hello'],
  })
}
