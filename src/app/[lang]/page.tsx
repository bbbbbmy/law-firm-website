import { PageLayout } from '@/components/layout'
import { BannerCarousel, ArticleList } from '@/components/blocks'

interface HomePageProps {
  params: Promise<{ lang: string }>
}

// Mock data for demonstration - will be replaced with actual DB data
const mockBanners = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920',
    overlayTextZh: '专业、诚信、高效\n为您的权益保驾护航',
    overlayTextEn: 'Professional, Honest, Efficient\nProtecting Your Rights',
    sortOrder: 0,
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1920',
    overlayTextZh: '汇聚精英律师团队\n提供全方位法律服务',
    overlayTextEn: 'Elite Team of Lawyers\nFull Range of Legal Services',
    sortOrder: 1,
  },
]

const mockArticles = [
  {
    id: '1',
    slug: 'law-firm-wins-award',
    type: 'news' as const,
    language: 'zh' as "zh" | "en",
    title: '本所荣获年度最佳律师事务所称号',
    summary: '凭借专业的法律服务和卓越的业绩表现，本所在年度评选中脱颖而出。',
    content: null,
    author: 'Admin',
    publishedAt: new Date('2024-03-15'),
  },
  {
    id: '2',
    slug: 'seminar-on-corporate-law',
    type: 'news' as const,
    language: 'zh' as "zh" | "en",
    title: '本所举办企业合规专题研讨会',
    summary: '近日，本所成功举办了企业合规专题研讨会，吸引了众多企业代表参加。',
    content: null,
    author: 'Admin',
    publishedAt: new Date('2024-03-10'),
  },
  {
    id: '3',
    slug: 'new-partner-joined',
    type: 'news' as const,
    language: 'zh' as "zh" | "en",
    title: '知名律师李明加入本所担任合伙人',
    summary: '李律师在并购重组领域拥有丰富经验，将为客户提供更专业的服务。',
    content: null,
    author: 'Admin',
    publishedAt: new Date('2024-03-05'),
  },
]

const mockBusinessAreas = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    overlayTextZh: '民商事纠纷\n民事诉讼、合同纠纷、公司业务',
    overlayTextEn: 'Civil Disputes\nLitigation, Contract, Corporate',
    sortOrder: 0,
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800',
    overlayTextZh: '刑事辩护\n刑事辩护、取保候审',
    overlayTextEn: 'Criminal Defense\nDefense, Bail',
    sortOrder: 1,
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
    overlayTextZh: '行政纠纷\n行政复议、行政诉讼',
    overlayTextEn: 'Administrative Disputes\nAdmin Litigation',
    sortOrder: 2,
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1521791055396-9459823f0dde?w=800',
    overlayTextZh: '涉外纠纷\n国际贸易、跨境投资',
    overlayTextEn: 'Foreign-Related\nIntl Trade, Investment',
    sortOrder: 3,
  },
]

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params

  return (
    <PageLayout lang={lang as "zh" | "en"}>
      {/* Banner Carousel */}
      <BannerCarousel banners={mockBanners} lang={lang as "zh" | "en"} />

      {/* Firm Introduction */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600"
                alt="Law Firm"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {lang === 'zh' ? '关于我们' : 'About Us'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {lang === 'zh'
                  ? '我们是一家专业的律师事务所，致力于为客户提供高质量的法律服务。凭借多年的行业经验和专业知识，我们已在众多领域建立了卓越的声誉。'
                  : 'We are a professional law firm dedicated to providing high-quality legal services to our clients. With years of experience and expertise, we have established a strong reputation in many areas of law.'}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {lang === 'zh'
                  ? '我们的律师团队由一批经验丰富的专业人士组成，覆盖民商事纠纷、刑事辩护、行政诉讼、涉外法律服务等多个领域。'
                  : 'Our team consists of experienced professionals covering civil and commercial disputes, criminal defense, administrative litigation, foreign-related legal services, and more.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <ArticleList
        articles={mockArticles}
        lang={lang as "zh" | "en"}
        title={lang === 'zh' ? '资讯动态' : 'News'}
        viewMoreHref="/news"
      />

      {/* Business Areas */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {lang === 'zh' ? '业务领域' : 'Practice Areas'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockBusinessAreas.map((area) => (
              <div key={area.id} className="relative rounded-lg overflow-hidden h-48">
                <img
                  src={area.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <p className="text-white text-center font-medium whitespace-pre-line">
                    {lang === 'zh' ? area.overlayTextZh : area.overlayTextEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {lang === 'zh' ? '服务客户' : 'Our Clients'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Client {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}