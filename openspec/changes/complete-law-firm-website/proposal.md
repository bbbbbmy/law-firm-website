## Why

The law firm website (`web/`) has a solid structural foundation with Next.js 14, bilingual routing, and component architecture, but the implementation is incomplete. Core features like database models, admin authentication, content management workflows, media handling, and deployment configuration are missing or use mock data. This change completes the implementation to make the website production-ready.

## What Changes

**Database & Backend**
- Define and implement Prisma schema with PostgreSQL models for all content types
- Implement API routes for CRUD operations on articles, team members, banners, and pages
- Add proper error handling and validation

**Admin CMS - Core**
- Complete admin authentication (session-based login/logout)
- Build admin layout with sidebar navigation
- Add middleware protection for /admin routes

**Admin CMS - Content Management**
- Implement article CRUD with rich text editing (Tiptap)
- Implement team member management with photo upload
- Implement banner management with reordering
- Implement page content editing with language tabs

**Media & Storage**
- Implement local file upload for development
- Configure Alibaba Cloud OSS integration for production
- Build media library interface

**Deployment**
- Configure environment variables for production
- Setup Nginx configuration
- Add build optimization

## Capabilities

### New Capabilities
- `law-firm-website-db`: Database layer with Prisma ORM, models for Page, PageContent, TeamMember, Article, Banner, SiteConfig
- `law-firm-admin-api`: API routes for all admin content management operations
- `law-firm-media-oss`: OSS integration for image storage with local fallback for development
- `law-firm-admin-session`: Session-based admin authentication with secure cookie handling

### Modified Capabilities
- `public-website`: Currently uses mock data - will be updated to fetch from real database
- `admin-cms`: Partially scaffolded - will be completed with full CRUD functionality

## Impact

- Database models will be defined in `prisma/schema.prisma`
- New API routes under `src/app/api/admin/`
- Admin pages in `src/app/admin/` will become functional
- Environment configuration in `.env` will be updated
- New dependencies: ali-oss, iron-session (or next-auth alternative)