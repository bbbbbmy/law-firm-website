import { PageLayout, HeroBanner } from '@/components/layout'

interface ContactPageProps {
  params: Promise<{ lang: string }>
}

const contactContent = {
  zh: {
    title: '联系我们',
    address: '上海市浦东新区世纪大道100号上海中心大厦58层',
    phone: '021-12345678',
    email: 'info@lawfirm.com',
    wechatLabel: '微信公众号',
    serviceAccountLabel: '服务号',
  },
  en: {
    title: 'Contact Us',
    address: '58F, Shanghai Tower, 100 Century Avenue, Pudong New District, Shanghai',
    phone: '021-12345678',
    email: 'info@lawfirm.com',
    wechatLabel: 'WeChat Official Account',
    serviceAccountLabel: 'WeChat Service Account',
  },
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params
  const content = lang === 'zh' ? contactContent.zh : contactContent.en

  return (
    <PageLayout lang={lang as "zh" | "en"}>
      <HeroBanner

        title={content.title}
        backgroundImageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920"
      />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
              <svg className="w-10 h-10 text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="font-semibold text-gray-900 mb-2">
                {lang === 'zh' ? '地址' : 'Address'}
              </h3>
              <p className="text-gray-600 text-sm">{content.address}</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
              <svg className="w-10 h-10 text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 className="font-semibold text-gray-900 mb-2">
                {lang === 'zh' ? '电话' : 'Phone'}
              </h3>
              <p className="text-gray-600">{content.phone}</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
              <svg className="w-10 h-10 text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="font-semibold text-gray-900 mb-2">
                {lang === 'zh' ? '邮箱' : 'Email'}
              </h3>
              <p className="text-gray-600">{content.email}</p>
            </div>
          </div>

          {/* QR Codes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gray-400 text-sm">QR Code</span>
              </div>
              <h3 className="font-semibold text-gray-900">{content.wechatLabel}</h3>
            </div>

            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gray-400 text-sm">QR Code</span>
              </div>
              <h3 className="font-semibold text-gray-900">{content.serviceAccountLabel}</h3>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}