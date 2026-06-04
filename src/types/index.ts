export type Language = 'zh' | 'en'

export interface PageData {
  slug: string
  contents: {
    language: Language
    title: string | null
    content: string | null
    bannerImages: string[]
    metaDescription: string | null
  }[]
  banners: {
    id: string
    imageUrl: string
    overlayTextZh: string | null
    overlayTextEn: string | null
    sortOrder: number
  }[]
}

export interface TeamMemberData {
  id: string
  name: string
  titleZh: string | null
  titleEn: string | null
  bioZh: string | null
  bioEn: string | null
  photoUrl: string | null
  sortOrder: number
}

export interface ArticleData {
  id: string
  slug: string
  type: 'news' | 'case'
  language: Language
  title: string
  summary: string | null
  content: string | null
  author: string | null
  publishedAt: Date | null
}

export interface SiteConfigData {
  key: string
  value: string | null
  language: Language | null
}

export interface BannerData {
  id: string
  imageUrl: string
  overlayTextZh: string | null
  overlayTextEn: string | null
  sortOrder: number
}

export interface NavigationItem {
  label: string
  labelEn: string
  href: string
}

export const NAV_ITEMS: NavigationItem[] = [
  { label: '首页', labelEn: 'Home', href: '/' },
  { label: '关于我们', labelEn: 'About Us', href: '/about' },
  { label: '服务领域', labelEn: 'Services', href: '/services' },
  { label: '专业团队', labelEn: 'Team', href: '/team' },
  { label: '资讯动态', labelEn: 'News', href: '/news' },
  { label: '案例展示', labelEn: 'Cases', href: '/cases' },
  { label: '人才招聘', labelEn: 'Careers', href: '/careers' },
  { label: '联系我们', labelEn: 'Contact', href: '/contact' },
]