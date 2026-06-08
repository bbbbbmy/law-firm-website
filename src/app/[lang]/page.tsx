import { PageLayout } from '@/components/layout'
import { BannerCarousel, ArticleList } from '@/components/blocks'
import { prisma } from '@/lib/prisma'

interface HomePageProps {
  params: Promise<{ lang: string }>
}

interface SiteConfig {
  key: string
  value: string | null
  language: string | null
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params
  const language = lang === 'zh' ? 'zh' : 'en'

  // Fetch all data in parallel
  const [banners, articles, practiceAreas, clients, siteConfigs] = await Promise.all([
    prisma.banner.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.article.findMany({
      where: { language },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    }),
    prisma.practiceArea.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.client.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.siteConfig.findMany(),
  ])

  // Helper to get site config value
  const getConfig = (key: string, lang?: string) => {
    const configs = siteConfigs as SiteConfig[]
    const config = configs.find(c => c.key === key && (lang ? c.language === lang : !c.language))
    return config?.value ?? null
  }

  const aboutImage = getConfig('homepage_about_image_url') || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'
  const aboutTitle = language === 'zh'
    ? (getConfig('homepage_about_title_zh', 'zh') || '关于我们')
    : (getConfig('homepage_about_title_en', 'en') || 'About Us')
  const aboutContent = language === 'zh'
    ? (getConfig('homepage_about_content_zh', 'zh') || '我们是一家专业的律师事务所，致力于为客户提供高质量的法律服务。凭借多年的行业经验和专业知识，我们已在众多领域建立了卓越的声誉。')
    : (getConfig('homepage_about_content_en', 'en') || 'We are a professional law firm dedicated to providing high-quality legal services to our clients.')

  return (
    <PageLayout lang={language}>
      {/* Banner Carousel */}
      <BannerCarousel banners={banners} lang={language} />

      {/* Firm Introduction - Dynamic from SiteConfig */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={aboutImage}
                alt="Law Firm"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {aboutTitle}
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {aboutContent}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <ArticleList
        articles={articles.map(a => ({
          id: a.id,
          slug: a.slug,
          type: a.type as 'news' | 'case',
          language: a.language as 'zh' | 'en',
          title: a.title,
          summary: a.summary,
          content: a.content,
          author: a.author,
          publishedAt: a.publishedAt,
        }))}
        lang={language}
        title={language === 'zh' ? '资讯动态' : 'News'}
        viewMoreHref={`/${lang}/news`}
      />

      {/* Business Areas - Dynamic from database */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {language === 'zh' ? '业务领域' : 'Practice Areas'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceAreas.length === 0 ? (
              <p className="col-span-full text-center text-gray-400">
                {language === 'zh' ? '暂无业务领域' : 'No practice areas available'}
              </p>
            ) : (
              practiceAreas.map((area) => (
                <div key={area.id} className="relative rounded-lg overflow-hidden h-48">
                  <img
                    src={area.imageUrl}
                    alt={area.titleZh}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white text-center font-medium whitespace-pre-line">
                      {language === 'zh' ? `${area.titleZh}\n${area.descZh || ''}` : `${area.titleEn}\n${area.descEn || ''}`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Clients Section - Dynamic from database */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {language === 'zh' ? '服务客户' : 'Our Clients'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {clients.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                {language === 'zh' ? '暂无客户' : 'No clients available'}
              </p>
            ) : (
              clients.map((client) => (
                <div key={client.id} className="h-24 bg-gray-100 rounded-lg flex items-center justify-center p-4">
                  {client.logoUrl ? (
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="max-h-16 max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm text-center">{client.name}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}