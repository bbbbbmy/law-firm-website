/**
 * 「加入我们」公开页渲染测试。
 *
 * 覆盖两条路径：DB 有数据时用 DB 的，DB 报错时退回 src/lib/careersContent.ts
 * 的默认文案（远程库连不上时页面不能 500）。
 */

import { render, screen } from '@testing-library/react'

const mockCareersFindUnique = jest.fn()
const mockSiteConfigFindUnique = jest.fn()
const mockSiteConfigFindFirst = jest.fn()
const mockSiteConfigFindMany = jest.fn()
const mockContactFindUnique = jest.fn()

jest.mock('@/lib/prisma', () => ({
  prisma: {
    careersContent: { findUnique: (...a: unknown[]) => mockCareersFindUnique(...a) },
    siteConfig: {
      findUnique: (...a: unknown[]) => mockSiteConfigFindUnique(...a),
      findFirst: (...a: unknown[]) => mockSiteConfigFindFirst(...a),
      findMany: (...a: unknown[]) => mockSiteConfigFindMany(...a),
    },
    contactInfo: { findUnique: (...a: unknown[]) => mockContactFindUnique(...a) },
  },
}))

// PageLayout 是 async server component 且会查库/渲染 Header，这里换成轻量替身，
// 让断言只盯 CareersPage 自己渲染出来的板块。
jest.mock('@/components/layout', () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

import CareersPage from '@/app/[lang]/careers/page'
import { DEFAULT_CARDS, DEFAULT_CONTENT, DEFAULT_JOBS } from '@/lib/careersContent'

/**
 * CareersPage 是 async server component，返回 Promise。
 * 渲染前必须 await，否则断言跑在 DOM 生成之前，且未处理的 Promise
 * 会在测试进程退出时炸掉 Node。
 */
async function renderPage(lang: 'zh' | 'en' = 'zh') {
  const element = await CareersPage({ params: Promise.resolve({ lang }) })
  return render(element)
}

beforeEach(() => {
  jest.clearAllMocks()
  mockSiteConfigFindUnique.mockResolvedValue(null)
  mockSiteConfigFindFirst.mockResolvedValue(null)
  mockSiteConfigFindMany.mockResolvedValue([])
  mockContactFindUnique.mockResolvedValue(null)
  // 默认：DB 里没有 careers 行 → 走默认文案
  mockCareersFindUnique.mockResolvedValue(null)
})

describe('CareersPage (DB empty -> default copy)', () => {
  it('renders all eight sections of the design', async () => {
    await renderPage('zh')

    // 一 Banner
    expect(screen.getByText('加入我们')).toBeTruthy()
    expect(screen.getByText(/青年法律人培育计划/)).toBeTruthy()
    expect(screen.getByText(/青年兴，则法治事业兴/)).toBeTruthy()
    // 二 引言
    expect(screen.getByText('党建引领・筑造纯粹执业温床')).toBeTruthy()
    // 三 / 四 / 五 / 六 板块标题 + 英文小字
    expect(screen.getByText('优渥环境，筑牢成长根基')).toBeTruthy()
    expect(screen.getByText('重磅扶持：10% 点位，全包成本')).toBeTruthy()
    expect(screen.getByText('初心如磐，打造执业温床')).toBeTruthy()
    expect(screen.getByText('招募邀约')).toBeTruthy()
    expect(screen.getAllByText('ENVIRONMENT').length).toBeGreaterThan(0)
    expect(screen.getAllByText('SUPPORT').length).toBeGreaterThan(0)
    expect(screen.getAllByText('CREATION').length).toBeGreaterThan(0)
    expect(screen.getAllByText('INVITATION').length).toBeGreaterThan(0)
    // 七 / 八
    expect(screen.getByText('热招岗位')).toBeTruthy()
    expect(screen.getByText('联系我们')).toBeTruthy()
  })

  it('renders the 4 job cards with their titles and tags', async () => {
    await renderPage('zh')
    for (const job of DEFAULT_JOBS.zh) {
      expect(screen.getByText(job.title)).toBeTruthy()
      expect(screen.getByText(job.tags)).toBeTruthy()
    }
  })

  it('renders 岗位职责 only for the two roles that have duties', async () => {
    await renderPage('zh')
    expect(screen.getAllByText('岗位职责')).toHaveLength(2)
    expect(screen.getByText(/驻点合作顾问单位/)).toBeTruthy()
  })

  it('shows no salary figure anywhere', async () => {
    const { container } = await renderPage('zh')
    const text = container.textContent || ''
    expect(text).not.toMatch(/(底薪|月薪|年薪|薪资|薪酬)\s*[:：]?\s*\d/)
  })

  it('renders the 3 support cards', async () => {
    await renderPage('zh')
    for (const card of DEFAULT_CARDS.zh) {
      expect(screen.getByText(card.title)).toBeTruthy()
    }
  })

  it('falls back to the contact info from the brief when ContactInfo is empty', async () => {
    await renderPage('zh')
    expect(screen.getByText(/江苏省新沂市公园南路河畔雅居商业街三楼/)).toBeTruthy()
    expect(screen.getByText(/0516-81607188/)).toBeTruthy()
    expect(screen.getByText('江苏德善（新沂）律师事务所')).toBeTruthy()
  })

  it('gives every job card an 立即咨询 link to the contact page', async () => {
    await renderPage('zh')
    const links = screen.getAllByText('立即咨询')
    expect(links).toHaveLength(4)
    for (const link of links) {
      expect(link.getAttribute('href')).toBe('/lawfirm/zh/contact')
    }
  })

  it('renders the English page in English when lang=en', async () => {
    await renderPage('en')
    expect(screen.getByText('Join Us')).toBeTruthy()
    expect(screen.getByText('Open Positions')).toBeTruthy()
    // 4 张岗位卡片各有一个按钮
    expect(screen.getAllByText('Enquire Now')).toHaveLength(4)
    expect(screen.queryByText('加入我们')).toBeNull()
    expect(screen.queryByText('热招岗位')).toBeNull()
  })

  it('points the English enquiry buttons at the English contact page', async () => {
    await renderPage('en')
    for (const link of screen.getAllByText('Enquire Now')) {
      expect(link.getAttribute('href')).toBe('/lawfirm/en/contact')
    }
  })
})

describe('CareersPage (DB has content)', () => {
  it('prefers the DB copy over the defaults', async () => {
    mockCareersFindUnique.mockResolvedValue({
      bannerTitle: 'DB 大标题',
      bannerSubtitle: 'DB 副标题',
      bannerQuote: 'DB 引语',
      introTitle: 'DB 引言标题',
      introContent: 'DB 引言正文。',
      environmentTitle: 'DB 环境标题',
      environmentLabel: 'ENV',
      environmentContent: 'DB 环境正文。',
      environmentImageUrl: '/uploads/media/office.jpg',
      supportTitle: 'DB 扶持标题',
      supportLabel: 'SUP',
      supportLead: 'DB 引导段。',
      creationTitle: 'DB 初心标题',
      creationLabel: 'CRE',
      creationContent: 'DB 初心正文。',
      invitationTitle: 'DB 邀约标题',
      invitationLabel: 'INV',
      invitationContent: 'DB 邀约正文。',
      jobsTitle: 'DB 岗位标题',
      contactTitle: 'DB 联系标题',
      cards: [{ id: 'c1', title: 'DB 卡片一', content: 'DB 卡片一正文', sortOrder: 0 }],
      jobs: [
        {
          id: 'j1',
          title: 'DB 岗位一',
          tags: 'DB 标签',
          requirements: 'DB 要求',
          duties: 'DB 职责',
          photoUrl: null,
          sortOrder: 0,
        },
      ],
    })

    await renderPage('zh')

    expect(screen.getByText('DB 大标题')).toBeTruthy()
    expect(screen.getByText('DB 引言标题')).toBeTruthy()
    expect(screen.getByText('DB 卡片一')).toBeTruthy()
    expect(screen.getByText('DB 岗位一')).toBeTruthy()
    // 默认文案此时不应出现
    expect(screen.queryByText('加入我们')).toBeNull()
    expect(screen.queryByText('低点位分成，收益归己')).toBeNull()
  })

  it('orders cards and jobs by sortOrder', async () => {
    mockCareersFindUnique.mockResolvedValue({
      ...DEFAULT_CONTENT.zh,
      cards: [
        { id: 'c2', title: '第二张卡', content: '正文二', sortOrder: 1 },
        { id: 'c1', title: '第一张卡', content: '正文一', sortOrder: 0 },
      ],
      jobs: [
        {
          id: 'j2',
          title: '第二个岗',
          tags: 't',
          requirements: 'r',
          duties: '',
          photoUrl: null,
          sortOrder: 1,
        },
        {
          id: 'j1',
          title: '第一个岗',
          tags: 't',
          requirements: 'r',
          duties: '',
          photoUrl: null,
          sortOrder: 0,
        },
      ],
    })

    await renderPage('zh')

    // DOM 顺序应跟 sortOrder 一致（0 在 1 前）
    const html = document.body.innerHTML
    expect(html.indexOf('第一张卡')).toBeLessThan(html.indexOf('第二张卡'))
    expect(html.indexOf('第一个岗')).toBeLessThan(html.indexOf('第二个岗'))
  })

  it('uses ContactInfo over the built-in fallback', async () => {
    mockContactFindUnique.mockResolvedValue({
      address: '后台配置的地址',
      phone: '后台配置的电话',
    })
    await renderPage('zh')
    expect(screen.getByText(/后台配置的地址/)).toBeTruthy()
    expect(screen.queryByText(/河畔雅居/)).toBeNull()
  })
})

describe('CareersPage (DB unreachable)', () => {
  it('still renders the whole page from defaults instead of throwing', async () => {
    mockCareersFindUnique.mockRejectedValue(new Error('P1000 Authentication failed'))
    mockSiteConfigFindUnique.mockRejectedValue(new Error('P1000 Authentication failed'))
    mockContactFindUnique.mockRejectedValue(new Error('P1000 Authentication failed'))
    mockSiteConfigFindFirst.mockRejectedValue(new Error('P1000 Authentication failed'))

    await expect(renderPage('zh')).resolves.toBeTruthy()
    expect(screen.getByText('加入我们')).toBeTruthy()
    expect(screen.getByText('热招岗位')).toBeTruthy()
    expect(screen.getByText(/河畔雅居/)).toBeTruthy()
  })

  it('keeps rendering when only careersContent fails but ContactInfo works', async () => {
    mockCareersFindUnique.mockRejectedValue(new Error('table missing'))
    mockContactFindUnique.mockResolvedValue({ address: '地址X', phone: '电话X' })

    await renderPage('zh')
    expect(screen.getByText('加入我们')).toBeTruthy()
    expect(screen.getByText(/地址X/)).toBeTruthy()
  })
})