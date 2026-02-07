import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@/app/globals.css'
import '@/app/layout.css'

export const metadata: Metadata = {
  title: 'catchmind',
  description: 'catchmind',
}

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
