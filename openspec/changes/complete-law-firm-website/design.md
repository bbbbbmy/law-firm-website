## Context

The law firm website exists as a Next.js 14 project with App Router, Tailwind CSS, and a component structure. The database layer is not yet implemented (no Prisma schema), admin authentication is incomplete, and all content currently uses hardcoded mock data. The website needs to be completed to serve as a fully functional bilingual CMS-backed site.

**Current State:**
- Next.js 14 with App Router, TypeScript, Tailwind CSS configured
- Component library exists (Header, Footer, HeroBanner, BannerCarousel, etc.)
- Bilingual routing with `/[lang]/` prefix working
- Admin routes scaffolded but non-functional
- No database, no real API routes
- All content is hardcoded/mocked

**Constraints:**
- Must use PostgreSQL with Prisma ORM
- Must use Alibaba Cloud OSS for file storage in production
- Session-based admin authentication (no third-party auth providers)
- Existing component structure must be preserved

## Goals / Non-Goals

**Goals:**
- Implement Prisma schema with all content models
- Create API routes for CRUD operations on all content types
- Complete admin authentication flow
- Build functional admin CMS pages for content management
- Integrate OSS for image storage (with local fallback for dev)
- Ensure bilingual content support throughout
- Production-ready deployment configuration

**Non-Goals:**
- Building new public-facing pages (already exist)
- Implementing search functionality (deferred to future change)
- Adding third-party analytics or tracking
- Mobile native app support
- Advanced SEO optimization beyond basic meta tags

## Decisions

### 1. Database Models (Prisma Schema)

```
model Page {
  id        String   @id @default(cuid())
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  contents  PageContent[]
  @@map("pages")
}

model PageContent {
  id            String   @id @default(cuid())
  pageId        String
  language      Language
  title         String?
  content       Json?    // Rich text as JSON
  bannerImages  String[]
  metaDescription String?
  page          Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  @@unique([pageId, language])
  @@map("page_contents")
}

model TeamMember {
  id        String   @id @default(cuid())
  name      String
  titleZh   String?
  titleEn   String?
  bioZh     String?
  bioEn     String?
  photoUrl  String?
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("team_members")
}

model Article {
  id          String    @id @default(cuid())
  slug        String    @unique
  type        ArticleType
  language    Language
  title       String
  summary     String?
  content     Json?     // Rich text as JSON
  author      String?
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  @@unique([slug, language])
  @@map("articles")
}

model Banner {
  id             String   @id @default(cuid())
  imageUrl       String
  overlayTextZh  String?
  overlayTextEn  String?
  sortOrder      Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  @@map("banners")
}

model SiteConfig {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String?
  language  Language?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("site_configs")
}

enum Language {
  zh
  en
}

enum ArticleType {
  news
  case
}
```

### 2. Admin Authentication

**Choice:** iron-session for cookie-based sessions

**Rationale:**
- Works well with Next.js API routes
- No external service dependencies
- Signed cookies prevent tampering
- Simple session invalidation

**Alternative considered:** NextAuth.js - rejected because:
- Overkill for single-admin use case
- Adds complexity with OAuth providers
- Session handling becomes more complex

**Session structure:**
```typescript
interface AdminSession {
  adminId: string;
  email: string;
  isLoggedIn: boolean;
}
```

### 3. File Upload Strategy

**Development:** Local filesystem (`./uploads/*`)

**Production:** Alibaba Cloud OSS

**Implementation:**
- Abstract upload service that detects environment
- Development: save to local `public/uploads/` directory
- Production: upload to OSS bucket, return public URL
- Same API interface for both environments

### 4. API Route Structure

```
/api/admin/auth/login     POST   - Admin login
/api/admin/auth/logout    POST   - Admin logout
/api/admin/auth/session   GET   - Get current session
/api/admin/articles      GET, POST - List/create articles
/api/admin/articles/[id] PUT, DELETE - Update/delete article
/api/admin/team          GET, POST - List/create team members
/api/admin/team/[id]     PUT, DELETE - Update/delete team member
/api/admin/banners       GET, POST - List/create banners
/api/admin/banners/[id]  PUT, DELETE - Update/delete banner
/api/admin/pages/[slug]   GET, PUT   - Get/update page content
/api/upload              POST   - File upload endpoint
```

### 5. Rich Text Editing

**Choice:** Tiptap editor (already installed)

Tiptap was already added as a dependency, so we use it consistently:
- Article content stored as Tiptap JSON format
- Page content stored as Tiptap JSON format
- Consistent editing experience across all content types

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| OSS credentials in .env exposed | Security breach | Use Aliyun RAM credentials with limited permissions; never commit .env |
| Bilingual content drift | Content becomes inconsistent between zh/en | Admin UI shows both languages side-by-side; validation hints |
| Large image uploads | Slow transfer, high OSS storage cost | Implement client-side compression; 5MB file size limit |
| Database migrations in production | Downtime if not handled carefully | Use Prisma migrate with --create-only, manual apply during maintenance window |

**Trade-offs Accepted:**
- Using hardcoded mock data initially means pages load without real content - acceptable since admin CMS will provide content management
- iron-session doesn't support immediate logout across devices - acceptable for single-admin use case
- Local uploads in dev vs OSS in prod creates slight behavior difference - documented in environment setup

## Migration Plan

**Phase 1: Database Foundation**
1. Create Prisma schema with all models
2. Run initial migration
3. Seed initial admin user and sample content

**Phase 2: API Routes**
1. Implement authentication endpoints
2. Implement content CRUD endpoints
3. Implement file upload service

**Phase 3: Admin CMS Completion**
1. Connect admin pages to API routes
2. Implement rich text editing
3. Implement media library

**Phase 4: Public Pages Connection**
1. Update all public pages to fetch from database
2. Remove mock data
3. Test bilingual routing with real content

**Phase 5: Deployment**
1. Configure production .env with real credentials
2. Setup OSS bucket and CDN
3. Configure Nginx
4. Run production build and test

## Open Questions

| Question | Status | Notes |
|----------|--------|-------|
| Admin credentials (initial setup) | Open | Need to decide: seed a default admin or require setup on first deploy |
| OSS region selection | Open | Affects bucket creation - should match server region for latency |
| Banner image dimensions | Resolved | 1920x800px recommended, will add validation |
| Default content for new installs | Resolved | Include seed script with sample articles, team members, banners |
| SSL certificate approach | Resolved | Use Let's Encrypt with certbot via Nginx |