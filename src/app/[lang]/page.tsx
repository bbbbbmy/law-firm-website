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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src={aboutImage}
                alt="Law Firm"
                className="rounded-lg shadow-xl w-full"
              />
              {/* Gold accent frame */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-gold-400 rounded-lg -z-10" />
            </div>
            <div>
              <div className="w-12 h-1 bg-gold-500 mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-6">
                {aboutTitle}
              </h2>
              <p className="text-navy-600 leading-relaxed whitespace-pre-line text-lg">
                {aboutContent}
              </p>
              <div className="mt-8 flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-600">20+</div>
                  <div className="text-sm text-navy-500">{language === 'zh' ? '年经验' : 'Years Experience'}</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-600">1000+</div>
                  <div className="text-sm text-navy-500">{language === 'zh' ? '成功案例' : 'Cases Won'}</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-600">50+</div>
                  <div className="text-sm text-navy-500">{language === 'zh' ? '专业律师' : 'Expert Lawyers'}</div>
                </div>
              </div>
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
          coverImageUrl: a.coverImageUrl,
          author: a.author,
          publishedAt: a.publishedAt,
        }))}
        lang={language}
        title={language === 'zh' ? '资讯动态' : 'News'}
        viewMoreHref="/news"
      />

      {/* Business Areas - Dynamic from database */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-12 h-1 bg-gold-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">
              {language === 'zh' ? '业务领域' : 'Practice Areas'}
            </h2>
            <p className="text-navy-300 max-w-2xl mx-auto">
              {language === 'zh'
                ? '我们提供全方位的法律服务，覆盖多个专业领域'
                : 'We provide comprehensive legal services across multiple practice areas'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceAreas.length === 0 ? (
              <p className="col-span-full text-center text-navy-400">
                {language === 'zh' ? '暂无业务领域' : 'No practice areas available'}
              </p>
            ) : (
              practiceAreas.map((area) => {
                const href = area.articleSlug
                  ? `/${lang}/cases/${area.articleSlug}`
                  : `/${lang}/services`
                return (
                  <a
                    key={area.id}
                    href={href}
                    className="group relative rounded-lg overflow-hidden h-48 block cursor-pointer"
                  >
                    <img
                      src={area.imageUrl}
                      alt={area.titleZh}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-8 h-0.5 bg-gold-500 mb-3" />
                      <p className="text-white font-semibold whitespace-pre-line">
                        {language === 'zh' ? area.titleZh : area.titleEn}
                      </p>
                      {area.articleSlug && (
                        <span className="text-gold-400 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {language === 'zh' ? '点击查看详情 →' : 'View Details →'}
                        </span>
                      )}
                    </div>
                  </a>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Clients Section - Dynamic from database */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-12 h-1 bg-gold-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-navy-900 mb-2">
              {language === 'zh' ? '服务客户' : 'Our Clients'}
            </h2>
            <p className="text-navy-500 max-w-2xl mx-auto">
              {language === 'zh'
                ? '我们为各类企业及个人客户提供专业法律服务'
                : 'We provide professional legal services to various businesses and individuals'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {clients.length === 0 ? (
              <p className="col-span-full text-center text-navy-400">
                {language === 'zh' ? '暂无客户' : 'No clients available'}
              </p>
            ) : (
              clients.map((client) => (
                <div key={client.id} className="h-24 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center p-4 hover:shadow-md hover:border-gold-300 transition-all duration-200">
                  {client.logoUrl ? (
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="max-h-16 max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <span className="text-navy-400 text-sm text-center">{client.name}</span>
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