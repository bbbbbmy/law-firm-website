import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  })
  console.log('Created admin user: admin / admin123')

  // Create home page
  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: { slug: 'home' },
  })

  await prisma.pageContent.upsert({
    where: { pageId_language: { pageId: homePage.id, language: 'zh' } },
    update: {},
    create: {
      pageId: homePage.id,
      language: 'zh',
      title: '首页',
      content: '欢迎访问我们的律师事务所',
    },
  })

  await prisma.pageContent.upsert({
    where: { pageId_language: { pageId: homePage.id, language: 'en' } },
    update: {},
    create: {
      pageId: homePage.id,
      language: 'en',
      title: 'Home',
      content: 'Welcome to our law firm',
    },
  })

  // Create About page
  const aboutPage = await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: { slug: 'about' },
  })

  await prisma.pageContent.upsert({
    where: { pageId_language: { pageId: aboutPage.id, language: 'zh' } },
    update: {},
    create: {
      pageId: aboutPage.id,
      language: 'zh',
      title: '关于我们',
      content: '我们是一家专业的律师事务所...',
    },
  })

  await prisma.pageContent.upsert({
    where: { pageId_language: { pageId: aboutPage.id, language: 'en' } },
    update: {},
    create: {
      pageId: aboutPage.id,
      language: 'en',
      title: 'About Us',
      content: 'We are a professional law firm...',
    },
  })

  // Create banner for home page
  await prisma.banner.upsert({
    where: { id: 'banner-home-1' },
    update: {},
    create: {
      id: 'banner-home-1',
      pageId: homePage.id,
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920',
      overlayTextZh: '专业、诚信、高效\n为您的权益保驾护航',
      overlayTextEn: 'Professional, Honest, Efficient\nProtecting Your Rights',
      sortOrder: 0,
    },
  })

  // Create sample team members
  const teamMembers = [
    {
      name: '张伟',
      titleZh: '创始合伙人',
      titleEn: 'Founding Partner',
      bioZh: '张律师毕业于北京大学法学院，从业20余年。',
      bioEn: 'Attorney Zhang graduated from Peking University Law School with 20+ years experience.',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
    {
      name: '李明',
      titleZh: '合伙人',
      titleEn: 'Partner',
      bioZh: '李律师是中国政法大学博士，擅长刑事辩护。',
      bioEn: 'Dr. Li from China University of Political Science, specializing in criminal defense.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
  ]

  for (let i = 0; i < teamMembers.length; i++) {
    const member = teamMembers[i]
    await prisma.teamMember.upsert({
      where: { id: `team-member-${i + 1}` },
      update: {},
      create: {
        id: `team-member-${i + 1}`,
        name: member.name,
        titleZh: member.titleZh,
        titleEn: member.titleEn,
        bioZh: member.bioZh,
        bioEn: member.bioEn,
        photoUrl: member.photoUrl,
        sortOrder: i,
      },
    })
  }
  console.log(`Created ${teamMembers.length} team members`)

  // Create sample articles
  const articles = [
    {
      slug: 'law-firm-wins-award',
      type: 'news',
      language: 'zh',
      title: '本所荣获年度最佳律师事务所称号',
      summary: '凭借专业的法律服务和卓越的业绩表现...',
    },
    {
      slug: 'seminar-on-corporate-law',
      type: 'news',
      language: 'zh',
      title: '本所举办企业合规专题研讨会',
      summary: '近日，本所成功举办了企业合规专题研讨会...',
    },
    {
      slug: 'major-merger-case',
      type: 'case',
      language: 'zh',
      title: '某上市公司重大资产重组案',
      summary: '为客户提供全程法律服务，顺利实现重大资产重组。',
    },
  ]

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i]
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        slug: article.slug,
        type: article.type,
        language: article.language,
        title: article.title,
        summary: article.summary,
        publishedAt: new Date(),
      },
    })
  }
  console.log(`Created ${articles.length} articles`)

  // Create site config
  await prisma.siteConfig.upsert({
    where: { key_language: { key: 'firm_name', language: 'zh' } },
    update: {},
    create: {
      key: 'firm_name',
      value: '律师事务所',
      language: 'zh',
    },
  })

  await prisma.siteConfig.upsert({
    where: { key_language: { key: 'firm_name', language: 'en' } },
    update: {},
    create: {
      key: 'firm_name',
      value: 'Law Firm',
      language: 'en',
    },
  })

  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })