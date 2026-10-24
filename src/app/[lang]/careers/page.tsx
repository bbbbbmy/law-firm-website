import { PageLayout } from '@/components/layout'
import { prisma } from '@/lib/prisma'
import { buildHref } from '@/lib/url'
import type { Language } from '@/types'
import {
  CAREERS_CONTACT_FALLBACK,
  CAREERS_ENV_IMAGE_FALLBACK,
  CAREERS_HERO_FALLBACK,
  DEFAULT_CARDS,
  DEFAULT_CONTENT,
  DEFAULT_JOBS,
  sortByOrder,
  type CareersCardData,
  type CareersContentData,
  type CareersJobData,
} from '@/lib/careersContent'
import {
  CareersBanner,
  ContactSection,
  CreationSection,
  EnvironmentSection,
  InvitationSection,
  JobsSection,
  SupportSection,
} from '@/components/blocks/CareersSections'

// 「加入我们」页依赖数据库查询，需运行时渲染避免 build 期连接 DB
export const dynamic = 'force-dynamic'

interface CareersPageProps {
  params: Promise<{ lang: string }>
}

const UI = {
  zh: {
    environmentImageLabel: '办公环境',
    ctaLabel: '立即咨询',
    dutiesLabel: '岗位职责',
    addressLabel: '律所地址',
    phoneLabel: '咨询电话',
    firmName: '江苏德善（新沂）律师事务所',
  },
  en: {
    environmentImageLabel: 'Office Environment',
    ctaLabel: 'Enquire Now',
    dutiesLabel: 'Responsibilities',
    addressLabel: 'Address',
    phoneLabel: 'Phone',
    firmName: 'Jiangsu Deshan (Xinyi) Law Firm',
  },
} as const

export default async function CareersPage({ params }: CareersPageProps) {
  const { lang } = await params
  const language: Language = lang === 'zh' ? 'zh' : 'en'
  const labels = UI[language]

  // DB 优先；任一查询失败都退回默认文案，保证页面永远能渲染。
  let content: CareersContentData = DEFAULT_CONTENT[language]
  let cards: CareersCardData[] = DEFAULT_CARDS[language].map((c, i) => ({ ...c, id: `default-card-${i}` }))
  let jobs: CareersJobData[] = DEFAULT_JOBS[language].map((j, i) => ({ ...j, id: `default-job-${i}` }))
  let envImageUrl: string | null = DEFAULT_CONTENT[language].environmentImageUrl

  try {
    const row = await prisma.careersContent.findUnique({
      where: { language },
      include: { cards: true, jobs: true },
    })

    if (row) {
      content = {
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
      }
      if (row.cards.length > 0) {
        cards = sortByOrder(row.cards)
      }
      if (row.jobs.length > 0) {
        jobs = sortByOrder(row.jobs)
      }
      if (row.environmentImageUrl) {
        envImageUrl = row.environmentImageUrl
      }
    }
  } catch (error) {
    console.error('Error loading careers content, falling back to defaults:', error)
  }

  // Banner 背景：后台 SiteConfig 优先，其次兜底图，都没有就退化成渐变块
  let heroBg: string | undefined
  try {
    heroBg = (await prisma.siteConfig.findUnique({ where: { key: 'hero_bg_careers' } }))?.value || undefined
  } catch {
    // SiteConfig 读失败：沿用兜底图
  }

  // 底部联系方式：ContactInfo 表优先（后台可维护），为空才用方案里这份
  let address = ''
    let phone = ''
    let firmName: string = labels.firmName
  try {
    const [contact, firmNameConfig] = await Promise.all([
          prisma.contactInfo.findUnique({ where: { language } }),
          // 与 PageLayout 同一约定：key 固定为 firm_name，语言走 language 列
          prisma.siteConfig.findFirst({ where: { key: 'firm_name', language } }),
        ])
    address = contact?.address || CAREERS_CONTACT_FALLBACK.address
    phone = contact?.phone || CAREERS_CONTACT_FALLBACK.phone
    if (firmNameConfig?.value) firmName = firmNameConfig.value
  } catch {
    address = CAREERS_CONTACT_FALLBACK.address
    phone = CAREERS_CONTACT_FALLBACK.phone
  }

  return (
    <PageLayout lang={language}>
      {/* 一、首屏 Banner */}
      <CareersBanner
        title={content.bannerTitle}
        subtitle={content.bannerSubtitle}
        quote={content.bannerQuote}
        imageUrl={heroBg || CAREERS_HERO_FALLBACK}
      />

      {/* 二、开篇引言：白色区块，左右留边 */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-navy-900 text-center tracking-wide">
            {content.introTitle}
          </h2>
          <div className="mt-4 h-px w-16 mx-auto bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          <div className="mt-10 space-y-6">
            {content.introContent.split(/\n\s*\n/).filter(Boolean).map((p, i) => (
              <p key={i} className="text-[15px] md:text-base leading-[2] text-indent-2em text-gray-700">
                {p.trim()}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 三、板块 1｜优渥环境，筑牢成长根基 */}
      <EnvironmentSection
        title={content.environmentTitle}
        label={content.environmentLabel}
        content={content.environmentContent}
        imageUrl={envImageUrl || CAREERS_ENV_IMAGE_FALLBACK}
        imageLabel={labels.environmentImageLabel}
      />

      {/* 四、板块 2｜重磅扶持：10% 点位，全包成本 */}
      <SupportSection
        title={content.supportTitle}
        label={content.supportLabel}
        lead={content.supportLead}
        cards={cards.map((c) => ({ id: c.id, title: c.title, content: c.content }))}
      />

      {/* 五、板块 3｜初心如磐，打造执业温床 */}
      <CreationSection
        title={content.creationTitle}
        label={content.creationLabel}
        content={content.creationContent}
      />

      {/* 六、板块 4｜招募邀约 */}
      <InvitationSection
        title={content.invitationTitle}
        label={content.invitationLabel}
        content={content.invitationContent}
      />

      {/* 七、板块 5｜热招岗位 */}
      <JobsSection
        title={content.jobsTitle}
        jobs={jobs}
        ctaLabel={labels.ctaLabel}
        dutiesLabel={labels.dutiesLabel}
        contactHref={`/lawfirm${buildHref('/contact', language)}`}
      />

      {/* 八、底部联系信息 */}
      <ContactSection
        title={content.contactTitle}
        address={address}
        phone={phone}
        firmName={firmName}
        addressLabel={labels.addressLabel}
        phoneLabel={labels.phoneLabel}
      />
    </PageLayout>
  )
}