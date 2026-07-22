import { getIronSession, type IronSession, type SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'

export interface AdminSession {
  adminId: string
  email: string
  isLoggedIn: boolean
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'law-firm-admin-session',
  cookieOptions: {
    // Secure 标志：只在 HTTPS 下发送 cookie。HTTP 站点下必须设为 false，
    // 否则浏览器收到 Set-Cookie 但不会回传（登录后 middleware 一直判定未登录）。
    // 部署到 HTTPS（Traefik + 域名 + 自动 SSL）时改回 true。
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
}

export const defaultSession: AdminSession = {
  adminId: '',
  email: '',
  isLoggedIn: false,
}

export async function getSession(): Promise<IronSession<AdminSession>> {
  const session = await getIronSession<AdminSession>(cookies(), sessionOptions)
  return session
}

// Decrypt a raw session cookie value — used by middleware
export async function decryptSession(
  cookieValue: string
): Promise<AdminSession | null> {
  try {
    const { unsealData } = await import('iron-session')
    const data = await unsealData<AdminSession>(cookieValue, {
      password: sessionOptions.password,
    })
    return {
      ...defaultSession,
      ...data,
      isLoggedIn: Boolean(data.adminId),
    }
  } catch {
    return null
  }
}