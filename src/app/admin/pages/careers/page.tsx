import { prisma } from '@/lib/prisma'
import CareersPageClient from '@/components/admin/CareersPageClient'
import { DEFAULT_CARDS, DEFAULT_CONTENT, DEFAULT_JOBS } from '@/lib/careersContent'
import type { CareersCardData, CareersContentData, CareersJobData } from '@/lib/careersContent'
import type { Language } from '@/types'

export const dynamic = 'force-dynamic'

// DB 里有就用 DB 的，没有就用 src/lib/careersContent.ts 的默认值兜底，
// 保证后台任何时候都打开得起来、也有一份完整文案可编辑。
async function loadLanguage(language: Language) {
  const row = await prisma.careersContent.findUnique({
    where: { language },
    include: { cards: true, jobs: true },
  })

  const defaults = DEFAULT_CONTENT[language]
  const fallbackCards: CareersCardData[] = DEFAULT_CARDS[language].map((c, i) => ({ ...c, id: `default-card-${i}` }))
  const fallbackJobs: CareersJobData[] = DEFAULT_JOBS[language].map((j, i) => ({ ...j, id: `default-job-${i}` }))

  if (!row) {
    return { content: defaults, cards: fallbackCards, jobs: fallbackJobs }
  }

  return {
    content: {
      language,
      bannerTitle: row.bannerTitle,
      bannerSubtitle: row.bannerSubtitle,
      bannerQuote: row.bannerQuote,
      introTitle: row.introTitle,
      introContent: row.introContent,
      environmentTitle: row.environmentTitle,
      environmentLabel: row.environmentLabel,
      environmentContent: row.environmentContent,
      environmentImageUrl: row.environmentImageUrl,
      supportTitle: row.supportTitle,
      supportLabel: row.supportLabel,
      supportLead: row.supportLead,
      creationTitle: row.creationTitle,
      creationLabel: row.creationLabel,
      creationContent: row.creationContent,
      invitationTitle: row.invitationTitle,
      invitationLabel: row.invitationLabel,
      invitationContent: row.invitationContent,
      jobsTitle: row.jobsTitle,
      contactTitle: row.contactTitle,
    } as CareersContentData,
    cards: row.cards.length > 0 ? row.cards : fallbackCards,
    jobs: row.jobs.length > 0 ? row.jobs : fallbackJobs,
  }
}

export default async function AdminCareersPage() {
  // 两边都兜底：后台读不到 zh 时不能把 en 也拖垮
  let zh
  let en
  try {
    zh = await loadLanguage('zh')
  } catch (error) {
    console.error('Error loading careers zh content:', error)
    zh = {
      content: DEFAULT_CONTENT.zh,
      cards: DEFAULT_CARDS.zh.map((c, i) => ({ ...c, id: `default-card-${i}` })),
      jobs: DEFAULT_JOBS.zh.map((j, i) => ({ ...j, id: `default-job-${i}` })),
    }
  }
  try {
    en = await loadLanguage('en')
  } catch (error) {
    console.error('Error loading careers en content:', error)
    en = {
      content: DEFAULT_CONTENT.en,
      cards: DEFAULT_CARDS.en.map((c, i) => ({ ...c, id: `default-card-${i}` })),
      jobs: DEFAULT_JOBS.en.map((j, i) => ({ ...j, id: `default-job-${i}` })),
    }
  }

  return <CareersPageClient initialContent={{ zh, en }} />
}