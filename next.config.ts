/**
 * next.config.ts
 * Next.js 프로젝트 설정 파일입니다.
 * React Strict Mode, outputFileTracingRoot(모노레포/다중 lockfile 경고 완화) 등을 설정합니다.
 */

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

/** ESM에서 __dirname 대체 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  /** React Strict Mode: 개발 시 이중 렌더링 등으로 잠재 문제 탐지 */
  reactStrictMode: true,
  /** 빌드 시 파일 추적 루트를 프로젝트 디렉터리로 고정 (lockfile 경고 완화) */
  outputFileTracingRoot: __dirname,
}

export default nextConfig
