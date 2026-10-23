import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_CARDS, DEFAULT_CONTENT, DEFAULT_JOBS } from '@/lib/careersContent'
import type { Language } from '@/types'

/**
 * 「加入我们」页面内容的读写。
 *
 * GET  返回 zh/en 两份完整内容（DB 没有就用默认值兜底），
 *      让后台永远拿得到一份可编辑的完整文案。
 * PUT  按语言整份覆盖：先 upsert 主表，再整体替换 cards / jobs。
 *      卡片和岗位按 sortOrder 唯一，替换时整表删掉重建最省心，
 *      避免"改了一条顺序撞唯一键"这类问题。
 */

interface CardInput {
  title: string
  content: string
  sortOrder?: number
}

interface JobInput {
  title: string
  tags: string
  requirements: string
  duties?: string
  photoUrl?: string | null
  sortOrder?: number
}

function normalizeCards(input: CardInput[] | undefined, lang: Language) {
  const source = input && input.length > 0 ? input : DEFAULT_CARDS[lang]
  return source.map((c, i) => ({
    title: c.title ?? '',
    content: c.content ?? '',
    sortOrder: c.sortOrder ?? i,
  }))
}

function normalizeJobs(input: JobInput[] | undefined, lang: Language) {
  const source = input && input.length > 0 ? input : DEFAULT_JOBS[lang]
  return source.map((j, i) => ({
    title: j.title ?? '',
    tags: j.tags ?? '',
    requirements: j.requirements ?? '',
    duties: j.duties ?? '',
    photoUrl: j.photoUrl || null,
    sortOrder: j.sortOrder ?? i,
  }))
}

export async function GET() {
  try {
    const [zh, en] = await Promise.all([
      prisma.careersContent.findUnique({ where: { language: 'zh' }, include: { cards: true, jobs: true } }),
      prisma.careersContent.findUnique({ where: { language: 'en' }, include: { cards: true, jobs: true } }),
    ])

    return NextResponse.json({ zh, en })
  } catch (error) {
    console.error('Error fetching careers content:', error)
    // DB 读失败时返回默认值，后台仍可打开（只是没有已保存的版本）
    return NextResponse.json({ zh: null, en: null, fallback: DEFAULT_CONTENT })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const language: Language = data.language === 'en' ? 'en' : 'zh'
    const defaults = DEFAULT_CONTENT[language]

    // 正文块：缺字段时用默认值补齐，避免存进去半截内容
    const scalars = {
      bannerTitle: data.bannerTitle ?? defaults.bannerTitle,
      bannerSubtitle: data.bannerSubtitle ?? defaults.bannerSubtitle,
      bannerQuote: data.bannerQuote ?? defaults.bannerQuote,
      introTitle: data.introTitle ?? defaults.introTitle,
      introContent: data.introContent ?? defaults.introContent,
      environmentTitle: data.environmentTitle ?? defaults.environmentTitle,
      environmentLabel: data.environmentLabel ?? defaults.environmentLabel,
      environmentContent: data.environmentContent ?? defaults.environmentContent,
      environmentImageUrl: data.environmentImageUrl || null,
      supportTitle: data.supportTitle ?? defaults.supportTitle,
      supportLabel: data.supportLabel ?? defaults.supportLabel,
      supportLead: data.supportLead ?? defaults.supportLead,
      creationTitle: data.creationTitle ?? defaults.creationTitle,
      creationLabel: data.creationLabel ?? defaults.creationLabel,
      creationContent: data.creationContent ?? defaults.creationContent,
      invitationTitle: data.invitationTitle ?? defaults.invitationTitle,
      invitationLabel: data.invitationLabel ?? defaults.invitationLabel,
      invitationContent: data.invitationContent ?? defaults.invitationContent,
      jobsTitle: data.jobsTitle ?? defaults.jobsTitle,
      contactTitle: data.contactTitle ?? defaults.contactTitle,
    }

    const cards = normalizeCards(data.cards, language)
    const jobs = normalizeJobs(data.jobs, language)

    const saved = await prisma.$transaction(async (tx) => {
      const row = await tx.careersContent.upsert({
        where: { language },
        update: scalars,
        create: { language, ...scalars },
      })

      // 整表替换：sortOrder 上有唯一约束，增删改排序混在一起时局部更新容易撞键
      await tx.careersCard.deleteMany({ where: { careersId: row.id } })
      if (cards.length > 0) {
        await tx.careersCard.createMany({
          data: cards.map(c => ({ ...c, careersId: row.id })),
        })
      }

      await tx.careersJob.deleteMany({ where: { careersId: row.id } })
      if (jobs.length > 0) {
        await tx.careersJob.createMany({
          data: jobs.map(j => ({ ...j, careersId: row.id })),
        })
      }

      return tx.careersContent.findUnique({
        where: { id: row.id },
        include: { cards: true, jobs: true },
      })
    })

    return NextResponse.json(saved)
  } catch (error) {
    console.error('Error updating careers content:', error)
    return NextResponse.json(
      { error: 'Failed to update careers content' },
      { status: 500 }
    )
  }
}