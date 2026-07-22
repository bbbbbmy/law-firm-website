import { NextResponse } from 'next/server'

// 健康检查端点，给 docker healthcheck 和负载均衡器用
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'law-firm-website',
    timestamp: new Date().toISOString(),
  })
}
