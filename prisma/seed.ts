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

  // Create sample practice areas
  const practiceAreas = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      titleZh: '民商事纠纷',
      titleEn: 'Civil Disputes',
      descZh: '民事诉讼、合同纠纷、公司业务',
      descEn: 'Litigation, Contract, Corporate',
      sortOrder: 0,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800',
      titleZh: '刑事辩护',
      titleEn: 'Criminal Defense',
      descZh: '刑事辩护、取保候审',
      descEn: 'Defense, Bail',
      sortOrder: 1,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
      titleZh: '行政纠纷',
      titleEn: 'Administrative Disputes',
      descZh: '行政复议、行政诉讼',
      descEn: 'Admin Litigation',
      sortOrder: 2,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1521791055396-9459823f0dde?w=800',
      titleZh: '涉外纠纷',
      titleEn: 'Foreign-Related',
      descZh: '国际贸易、跨境投资',
      descEn: 'Intl Trade, Investment',
      sortOrder: 3,
    },
  ]
  for (const area of practiceAreas) {
    await prisma.practiceArea.create({ data: area })
  }
  console.log('Created practice areas:', practiceAreas.length)

  // Create sample clients
  const clients = [
    {
      name: '阿里巴巴',
      logoUrl: 'https://via.placeholder.com/200x100.png?text=Alibaba',
      website: 'https://www.alibaba.com',
      sortOrder: 0,
    },
    {
      name: '腾讯',
      logoUrl: 'https://via.placeholder.com/200x100.png?text=Tencent',
      website: 'https://www.tencent.com',
      sortOrder: 1,
    },
    {
      name: '华为',
      logoUrl: 'https://via.placeholder.com/200x100.png?text=Huawei',
      website: 'https://www.huawei.com',
      sortOrder: 2,
    },
    {
      name: '京东',
      logoUrl: 'https://via.placeholder.com/200x100.png?text=JD',
      website: 'https://www.jd.com',
      sortOrder: 3,
    },
    {
      name: '百度',
      logoUrl: 'https://via.placeholder.com/200x100.png?text=Baidu',
      website: 'https://www.baidu.com',
      sortOrder: 4,
    },
    {
      name: '小米',
      logoUrl: 'https://via.placeholder.com/200x100.png?text=Xiaomi',
      website: 'https://www.xiaomi.com',
      sortOrder: 5,
    },
  ]
  for (const client of clients) {
    await prisma.client.create({ data: client })
  }
  console.log('Created clients:', clients.length)

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
    await prisma.article.upsert({
      where: { slug_language: { slug: article.slug, language: article.language } },
      update: {},
      create: article,
    })
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