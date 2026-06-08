import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { email: 'admin' },
    update: {},
    create: {
      email: 'admin',
      password: hashedPassword,
    },
  })
  console.log('Created admin user: admin / admin123')

  // Create sample pages
  const pageSlugs = ['about', 'services', 'team', 'news', 'cases', 'careers', 'contact']
  for (const slug of pageSlugs) {
    await prisma.page.upsert({
      where: { slug },
      update: {},
      create: { slug },
    })
  }
  console.log('Created pages:', pageSlugs.join(', '))

  // Create sample banners
  const banners = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920',
      overlayTextZh: '专业、诚信、高效\n为您的权益保驾护航',
      overlayTextEn: 'Professional, Honest, Efficient\nProtecting Your Rights',
      sortOrder: 0,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1920',
      overlayTextZh: '汇聚精英律师团队\n提供全方位法律服务',
      overlayTextEn: 'Elite Team of Lawyers\nFull Range of Legal Services',
      sortOrder: 1,
    },
  ]
  for (const banner of banners) {
    await prisma.banner.create({ data: banner })
  }
  console.log('Created banners:', banners.length)

  // Create sample team members
  const teamMembers = [
    {
      name: '张明',
      titleZh: '创始合伙人',
      titleEn: 'Founding Partner',
      bioZh: '张律师在民商事纠纷领域有20年经验，代理过多起重大案件。',
      bioEn: 'Zhang has 20 years of experience in civil and commercial disputes.',
      sortOrder: 0,
    },
    {
      name: '李华',
      titleZh: '高级合伙人',
      titleEn: 'Senior Partner',
      bioZh: '李律师专精刑事辩护和企业合规业务。',
      bioEn: 'Li specializes in criminal defense and corporate compliance.',
      sortOrder: 1,
    },
  ]
  for (const member of teamMembers) {
    await prisma.teamMember.create({ data: member })
  }
  console.log('Created team members:', teamMembers.length)

  // Create sample articles
  const articles = [
    {
      slug: 'law-firm-wins-award',
      type: 'news' as const,
      language: 'zh' as const,
      title: '本所荣获年度最佳律师事务所称号',
      summary: '凭借专业的法律服务和卓越的业绩表现，本所在年度评选中脱颖而出。',
      author: 'Admin',
      publishedAt: new Date('2024-03-15'),
    },
    {
      slug: 'seminar-on-corporate-law',
      type: 'news' as const,
      language: 'zh' as const,
      title: '本所举办企业合规专题研讨会',
      summary: '近日，本所成功举办了企业合规专题研讨会，吸引了众多企业代表参加。',
      author: 'Admin',
      publishedAt: new Date('2024-03-10'),
    },
  ]
  for (const article of articles) {
    await prisma.article.create({ data: article })
  }
  console.log('Created articles:', articles.length)

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })