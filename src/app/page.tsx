/**
 * page.tsx
 * 홈 페이지(/)의 내용을 정의합니다.
 * 접속자 목록, 타이틀, 랜덤 활동 컴포넌트를 배치합니다.
 */

import RandomActivity from '@/components/item'
import PresenceList from '@/components/PresenceList'
import './page.css'

/** 홈 페이지 컴포넌트 */
export default function Home() {
  return (
    <main className="main">
      <PresenceList />
      <h1>catchmind</h1>
      <p>Next.js 기본 세팅 완료닷</p>
      <RandomActivity />
    </main>
  )
}
