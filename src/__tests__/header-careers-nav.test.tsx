import { render, screen, within } from '@testing-library/react'
import Header from '@/components/layout/Header'

describe('Header careers navigation', () => {
  it.each([
    ['zh', '加入我们', '/zh/careers'],
    ['en', 'Join Us', '/en/careers'],
  ] as const)('shows the join-us link in the desktop %s navigation', (lang, label, suffix) => {
    const { container } = render(<Header lang={lang} />)
    const desktopNav = container.querySelector('nav.lg\\:flex')
    expect(desktopNav).not.toBeNull()
    const link = within(desktopNav as HTMLElement).getByRole('link', { name: label })
    expect(link.getAttribute('href')).toMatch(new RegExp(`${suffix}$`))
  })
})
