import { splitParagraphs } from '@/lib/careersContent'

/**
 * 「加入我们」页面的展示组件。纯展示，无数据获取——
 * 数据由 src/app/[lang]/careers/page.tsx 从 DB 读好后传进来。
 *
 * 视觉遵循设计稿：深蓝金配色（navy/gold，见 tailwind.config.ts），
 * 标题用 serif（大标题粗宋体观感），正文首行缩进 2em、宽松行距。
 */

/** 板块标题 + 英文小标签（浅灰） */
function SectionHeading({
  title,
  label,
  align = 'center',
}: {
  title: string
  label?: string
  align?: 'center' | 'left'
}) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <div
        className={
          align === 'center'
            ? 'flex flex-col items-center gap-2'
            : 'flex items-baseline gap-3 flex-wrap'
        }
      >
        <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-wide text-navy-900">
          {title}
        </h2>
        {label && (
          <span className="text-xs font-medium tracking-[0.25em] uppercase text-gray-400">
            {label}
          </span>
        )}
      </div>
      <div className="mt-4 h-px w-16 mx-auto bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
    </div>
  )
}

/** 正文段落：首行缩进 2em、行距宽松。text 内部用 \n\n 分段。 */
function BodyParagraphs({
  text,
  className = 'text-gray-700',
}: {
  text: string
  className?: string
}) {
  const paragraphs = splitParagraphs(text)
  if (paragraphs.length === 0) return null
  return (
    <>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={`text-[15px] md:text-base leading-[2] text-indent-2em ${className}`}
        >
          {p}
        </p>
      ))}
    </>
  )
}

/** 无图时的品牌色渐变占位块（配置了图片就显示图片）。 */
function MediaBlock({
  src,
  alt,
  className = '',
  label,
}: {
  src?: string | null
  alt: string
  className?: string
  label?: string
}) {
  if (src) {
    return <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />
  }
  return (
    <div
      className={`w-full h-full min-h-[220px] bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 flex items-center justify-center ${className}`}
    >
      <span className="text-white/40 text-sm tracking-widest">{label ?? alt}</span>
    </div>
  )
}

/** 一、首屏 Banner：通栏大图 + 暗蒙版 + 居中文字叠加 */
function CareersBanner({
  title,
  subtitle,
  quote,
  imageUrl,
}: {
  title: string
  subtitle: string
  quote: string
  imageUrl?: string | null
}) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[60vh] min-h-[460px] w-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950" />
        )}
        {/* 暗蒙版，保证白字可读 */}
        <div className="absolute inset-0 bg-navy-950/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-px bg-gold-500/80 mb-8" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white tracking-[0.15em] leading-tight">
            {title}
          </h1>
          <p className="mt-6 text-sm md:text-base text-white/75 font-light tracking-wide">
            {subtitle}
          </p>
          <p className="mt-12 md:mt-16 text-base md:text-lg text-white/85 font-serif tracking-wide max-w-3xl leading-relaxed">
            {quote}
          </p>
          <div className="mt-10 flex items-center space-x-4">
            <div className="w-10 h-px bg-white/25" />
            <div className="w-16 h-px bg-gold-500/70" />
            <div className="w-10 h-px bg-white/25" />
          </div>
        </div>
      </div>
    </section>
  )
}

/** 三、板块 1｜优渥环境：左文右图两栏，移动端上图下文 */
function EnvironmentSection({
  title,
  label,
  content,
  imageUrl,
  imageLabel,
}: {
  title: string
  label: string
  content: string
  imageUrl?: string | null
  imageLabel: string
}) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <SectionHeading title={title} label={label} align="left" />
            <div className="mt-8 space-y-5">
              <BodyParagraphs text={content} />
            </div>
          </div>
          <div className="lg:w-1/2 order-1 lg:order-2">
            <div className="rounded-lg overflow-hidden shadow-lg aspect-[4/3] lg:aspect-[3/4] max-h-[560px]">
              <MediaBlock src={imageUrl} alt={imageLabel} label={imageLabel} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** 四、板块 2｜重磅扶持：浅品牌色通栏 + 3 张等宽卡片 */
function SupportSection({
  title,
  label,
  lead,
  cards,
}: {
  title: string
  label: string
  lead: string
  cards: { id: string; title: string; content: string }[]
}) {
  return (
    <section className="py-20 bg-gradient-to-b from-navy-50 to-navy-100/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} label={label} />
        <div className="mt-8 max-w-4xl mx-auto space-y-5">
          <BodyParagraphs text={lead} className="text-navy-800/80" />
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(card => (
            <div
              key={card.id}
              className="bg-white rounded-lg border border-navy-100 shadow-sm p-7 flex flex-col"
            >
              <div className="w-10 h-1 bg-gold-500 mb-5" />
              <h3 className="text-lg font-bold text-navy-900 mb-4">{card.title}</h3>
              <p className="text-sm leading-[1.9] text-gray-600">{card.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** 五、板块 3｜初心如磐：极浅品牌色底色通栏文字 */
function CreationSection({
  title,
  label,
  content,
}: {
  title: string
  label: string
  content: string
}) {
  return (
    <section className="py-20 bg-navy-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} label={label} />
        <div className="mt-10 space-y-6">
          <BodyParagraphs text={content} />
        </div>
      </div>
    </section>
  )
}

/** 六、板块 4｜招募邀约：居中雅致过渡段 */
function InvitationSection({
  title,
  label,
  content,
}: {
  title: string
  label: string
  content: string
}) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeading title={title} label={label} />
        <div className="mt-10 space-y-5">
          <BodyParagraphs text={content} />
        </div>
      </div>
    </section>
  )
}

/** 七、板块 5｜热招岗位：PC 四列 / 平板两列 / 手机单列 */
function JobsSection({
  title,
  jobs,
  ctaLabel,
  dutiesLabel,
  contactHref,
}: {
  title: string
  jobs: {
    id: string
    title: string
    tags: string
    requirements: string
    duties: string
    photoUrl: string | null
  }[]
  ctaLabel: string
  dutiesLabel: string
  contactHref: string
}) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-navy-900 tracking-wide">
            {title}
          </h2>
          <div className="mt-4 h-px w-16 mx-auto bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {jobs.map(job => (
            <div
              key={job.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col"
            >
              {job.photoUrl && (
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={job.photoUrl}
                    alt={job.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-navy-900">{job.title}</h3>
                {job.tags && (
                  <p className="mt-3 text-xs text-gray-500 leading-relaxed tracking-wide">
                    {job.tags}
                  </p>
                )}
                {job.requirements && (
                  <p className="mt-4 text-sm leading-[1.9] text-gray-600">
                    {job.requirements}
                  </p>
                )}
                {job.duties && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-navy-800 mb-1.5">
                      {dutiesLabel}
                    </p>
                    <p className="text-sm leading-[1.9] text-gray-600">{job.duties}</p>
                  </div>
                )}
                <div className="mt-6 pt-2 flex-1" />
                <a
                  href={contactHref}
                  className="inline-flex items-center justify-center w-full px-5 py-2.5 mt-2 border border-gold-500 text-gold-700 text-sm font-medium rounded-md hover:bg-gold-500 hover:text-navy-900 transition-colors"
                >
                  {ctaLabel}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** 八、页面底部联系信息：深色通栏收尾 */
function ContactSection({
  title,
  address,
  phone,
  firmName,
  addressLabel,
  phoneLabel,
}: {
  title: string
  address: string
  phone: string
  firmName: string
  addressLabel: string
  phoneLabel: string
}) {
  if (!address && !phone) return null
  return (
    <section className="py-16 bg-navy-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold font-serif text-white tracking-[0.15em]">
          {title}
        </h2>
        <div className="mt-5 h-px w-16 mx-auto bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="mt-10 space-y-3 text-white/85 text-sm md:text-base">
          {address && (
            <p className="leading-relaxed">
              {addressLabel}：{address}
            </p>
          )}
          {phone && (
            <p className="leading-relaxed">
              {phoneLabel}：{phone}
            </p>
          )}
        </div>
        <p className="mt-12 text-sm text-white/55 tracking-widest">{firmName}</p>
      </div>
    </section>
  )
}

export {
  CareersBanner,
  EnvironmentSection,
  SupportSection,
  CreationSection,
  InvitationSection,
  JobsSection,
  ContactSection,
  SectionHeading,
  BodyParagraphs,
}