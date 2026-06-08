## ADDED Requirements

### Requirement: Prisma schema defines all content models
The system SHALL define a Prisma schema with models for Page, PageContent, TeamMember, Article, Banner, and SiteConfig, using PostgreSQL as the database provider.

#### Scenario: Page model exists
- **WHEN** Prisma schema is loaded
- **THEN** a Page model exists with fields: id (cuid), slug (unique string), createdAt, updatedAt, and relation to PageContent

#### Scenario: PageContent model supports bilingual content
- **WHEN** Prisma schema is loaded
- **THEN** a PageContent model exists with fields: id, pageId (relation to Page), language (enum zh/en), title, content (JSON), bannerImages (string array), metaDescription, and unique constraint on (pageId, language)

#### Scenario: TeamMember model stores lawyer profiles
- **WHEN** Prisma schema is loaded
- **THEN** a TeamMember model exists with fields: id, name, titleZh, titleEn, bioZh, bioEn, photoUrl, sortOrder, createdAt, updatedAt

#### Scenario: Article model supports news and cases
- **WHEN** Prisma schema is loaded
- **THEN** an Article model exists with fields: id, slug (unique), type (enum news/case), language (enum zh/en), title, summary, content (JSON), author, publishedAt, createdAt, updatedAt, with unique constraint on (slug, language)

#### Scenario: Banner model stores carousel images
- **WHEN** Prisma schema is loaded
- **THEN** a Banner model exists with fields: id, imageUrl, overlayTextZh, overlayTextEn, sortOrder, createdAt, updatedAt

#### Scenario: SiteConfig model stores key-value settings
- **WHEN** Prisma schema is loaded
- **THEN** a SiteConfig model exists with fields: id, key (unique), value, language (optional enum zh/en), createdAt, updatedAt

#### Scenario: Enums defined for Language and ArticleType
- **WHEN** Prisma schema is loaded
- **THEN** Language enum with values zh, en and ArticleType enum with values news, case are defined

### Requirement: Database migrations work correctly
The system SHALL provide working database migrations that create all tables with proper foreign key relationships.

#### Scenario: Initial migration creates all tables
- **WHEN** `prisma migrate dev` is run with initial schema
- **THEN** all tables (pages, page_contents, team_members, articles, banners, site_configs) are created with correct columns and constraints

#### Scenario: Migration can be applied to existing database
- **WHEN** `prisma migrate deploy` is run on a database with prior migrations
- **THEN** only new migrations are applied without data loss

### Requirement: Prisma client is accessible throughout the application
The system SHALL export a singleton Prisma client instance from `@/lib/prisma` for use in API routes.

#### Scenario: Prisma client can be imported
- **WHEN** an API route imports from `@/lib/prisma`
- **THEN** a valid PrismaClient instance is returned

#### Scenario: Prisma client handles connection pooling
- **WHEN** multiple API requests are made simultaneously
- **THEN** Prisma client manages connection pooling without exhausting database connections