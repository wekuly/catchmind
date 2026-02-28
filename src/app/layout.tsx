/**
 * layout.tsx
 * Next.js App Router의 루트 레이아웃입니다.
 * 모든 페이지에 공통으로 적용되는 HTML 구조, 메타데이터, 전역/레이아웃 스타일을 정의합니다.
 */

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@/app/globals.css'
import '@/app/layout.css'

/** SEO·브라우저 탭에 노출되는 메타데이터 */
export const metadata: Metadata = {
  title: 'catchmind',
  description: 'catchmind',
}

/**
 * 루트 레이아웃: html, body, .app-content로 자식 페이지를 감쌉니다.
 * @param children - 각 페이지 컴포넌트(page.tsx 등)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="ko">
      <body>
        <div className="app-content">{children}</div>
      </body>
    </html>
  )
}
