import RandomActivity from '@/components/item'
import PresenceList from '@/components/PresenceList'
import './page.css'

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
