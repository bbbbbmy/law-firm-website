import { PageLayout, HeroBanner } from '@/components/layout'
import { prisma } from '@/lib/prisma'

// 联系我们页面读取 contactInfo，运行时渲染
export const dynamic = 'force-dynamic'

interface ContactPageProps {
  params: Promise<{ lang: string }>
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params

  const contact = await prisma.contactInfo.findUnique({
    where: { language: lang as 'zh' | 'en' },
  })

  const content = {
    zh: {
      title: '联系我们',
      addressLabel: '地址',
      phoneLabel: '电话',
      emailLabel: '邮箱',
      wechatLabel: '微信公众号',
      serviceAccountLabel: '服务号',
      mapLabel: '查看地图',
    },
    en: {
      title: 'Contact Us',
      addressLabel: 'Address',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      wechatLabel: 'WeChat Official Account',
      serviceAccountLabel: 'WeChat Service Account',
      mapLabel: 'View Map',
    },
  }

  const labels = lang === 'zh' ? content.zh : content.en

  return (
    <PageLayout lang={lang as 'zh' | 'en'}>
      <HeroBanner
        title={content[lang as 'zh' | 'en'].title}
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
              <h3 className="font-semibold text-gray-900 mb-2">{labels.addressLabel}</h3>
              <p className="text-gray-600 text-sm">{contact?.address || '—'}</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
              <svg className="w-10 h-10 text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 className="font-semibold text-gray-900 mb-2">{labels.phoneLabel}</h3>
              <p className="text-gray-600">{contact?.phone || '—'}</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
              <svg className="w-10 h-10 text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="font-semibold text-gray-900 mb-2">{labels.emailLabel}</h3>
              <p className="text-gray-600">{contact?.email || '—'}</p>
            </div>
          </div>

          {/* QR Codes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              {contact?.wechatQrUrl ? (
                <div className="w-32 h-32 mb-4">
                  <img
                    src={contact.wechatQrUrl}
                    alt={labels.wechatLabel}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-gray-400 text-sm">QR</span>
                </div>
              )}
              <h3 className="font-semibold text-gray-900">{labels.wechatLabel}</h3>
            </div>

            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              {contact?.serviceQrUrl ? (
                <div className="w-32 h-32 mb-4">
                  <img
                    src={contact.serviceQrUrl}
                    alt={labels.serviceAccountLabel}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-gray-400 text-sm">QR</span>
                </div>
              )}
              <h3 className="font-semibold text-gray-900">{labels.serviceAccountLabel}</h3>
            </div>
          </div>

          {/* Map Link */}
          {contact?.mapUrl && (
            <div className="mt-8 text-center">
              <a
                href={contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {labels.mapLabel}
              </a>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
