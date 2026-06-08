## 1. Database Foundation

- [ ] 1.1 Create Prisma schema with all models (Page, PageContent, TeamMember, Article, Banner, SiteConfig, enums)
- [ ] 1.2 Configure Prisma provider for PostgreSQL
- [ ] 1.3 Update `@/lib/prisma` export with singleton pattern
- [ ] 1.4 Run initial `prisma migrate dev` to create tables
- [ ] 1.5 Create database seed script with sample admin user and content

## 2. Admin Authentication

- [ ] 2.1 Install iron-session package
- [ ] 2.2 Create session utility with iron-session configuration
- [ ] 2.3 Create session types (AdminSession interface)
- [ ] 2.4 Implement POST /api/admin/auth/login endpoint with bcrypt validation
- [ ] 2.5 Implement POST /api/admin/auth/logout endpoint
- [ ] 2.6 Implement GET /api/admin/auth/session endpoint
- [ ] 2.7 Create admin middleware for /admin routes
- [ ] 2.8 Update admin login page to use auth API

## 3. API Routes - Content CRUD

- [ ] 3.1 Implement GET /api/admin/articles (list all)
- [ ] 3.2 Implement POST /api/admin/articles (create)
- [ ] 3.3 Implement PUT /api/admin/articles/[id] (update)
- [ ] 3.4 Implement DELETE /api/admin/articles/[id] (delete)
- [ ] 3.5 Implement GET /api/admin/team (list all, sorted)
- [ ] 3.6 Implement POST /api/admin/team (create)
- [ ] 3.7 Implement PUT /api/admin/team/[id] (update)
- [ ] 3.8 Implement DELETE /api/admin/team/[id] (delete)
- [ ] 3.9 Implement GET /api/admin/banners (list all, sorted)
- [ ] 3.10 Implement POST /api/admin/banners (create)
- [ ] 3.11 Implement PUT /api/admin/banners/[id] (update)
- [ ] 3.12 Implement DELETE /api/admin/banners/[id] (delete)
- [ ] 3.13 Implement GET /api/admin/pages/[slug] (get page content)
- [ ] 3.14 Implement PUT /api/admin/pages/[slug] (update page content)

## 4. File Upload Service

- [ ] 4.1 Create upload service with environment detection
- [ ] 4.2 Implement local storage fallback for development
- [ ] 4.3 Install and configure ali-oss SDK
- [ ] 4.4 Implement OSS upload for production
- [ ] 4.5 Implement POST /api/upload endpoint
- [ ] 4.6 Add file validation (image types, 5MB size limit)

## 5. Admin CMS Pages

- [ ] 5.1 Update admin layout with sidebar navigation
- [ ] 5.2 Connect articles page to API routes (CRUD)
- [ ] 5.3 Connect team page to API routes (CRUD with photo upload)
- [ ] 5.4 Connect banners page to API routes (CRUD with reordering)
- [ ] 5.5 Connect settings page to API routes
- [ ] 5.6 Build media library page with grid view

## 6. Public Pages - Database Integration

- [ ] 6.1 Update home page to fetch banners and articles from database
- [ ] 6.2 Update about page to fetch content from database
- [ ] 6.3 Update services page to fetch content from database
- [ ] 6.4 Update team page to fetch team members from database
- [ ] 6.5 Update news page to fetch articles from database
- [ ] 6.6 Update cases page to fetch case articles from database
- [ ] 6.7 Update contact page to fetch content from database
- [ ] 6.8 Remove all hardcoded mock data

## 7. Deployment Configuration

- [ ] 7.1 Update .env.example with all required variables (DB, OSS, SESSION_SECRET)
- [ ] 7.2 Update .env with production values
- [ ] 7.3 Create Nginx configuration file
- [ ] 7.4 Create build script with optimization flags
- [ ] 7.5 Verify production build completes without errors